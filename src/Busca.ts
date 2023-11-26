import { Request, Response, Express } from 'express'
import oracledb, { ConnectionAttributes } from 'oracledb'

export default function setupBuscaVoos(
  app: Express,
  dbConfig: ConnectionAttributes
) {
  app.get('/busca-voos', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const tipo_passagem: string | undefined = req.query.tipo_passagem as
        | string
        | undefined
      const data_ida: string | undefined = req.query.data_ida as
        | string
        | undefined
      const data_retorno: string | undefined = req.query.data_retorno as
        | string
        | undefined
      const origem: string | undefined = req.query.origem as string | undefined
      const destino: string | undefined = req.query.destino as
        | string
        | undefined

      connection = await oracledb.getConnection(dbConfig)

      let query = `
        SELECT 
          v.COD_VOO,
          v.DATA_VOO,
          v.HORA_VOO,
          v.TIPO_VOO,
          origem.COD_AERO AS COD_AERO_ORIGEM,
          origem.NOME_AERO AS NOME_AERO_ORIGEM,
          origem.PAIS_AERO AS PAIS_AERO_ORIGEM,
          origem.CIDADE_AERO AS CIDADE_AERO_ORIGEM,
          destino.COD_AERO AS COD_AERO_DESTINO,
          destino.NOME_AERO AS NOME_AERO_DESTINO,
          destino.PAIS_AERO AS PAIS_AERO_DESTINO,
          destino.CIDADE_AERO AS CIDADE_AERO_DESTINO
        FROM VOOS v
        LEFT JOIN AEROPORTOS origem ON origem.COD_AERO = SUBSTR(v.TRECHO_VOO, 1, INSTR(v.TRECHO_VOO, ' -> ') - 1)
        LEFT JOIN AEROPORTOS destino ON destino.COD_AERO = SUBSTR(v.TRECHO_VOO, INSTR(v.TRECHO_VOO, ' -> ') + 4)
        WHERE 1 = 1
      `
      const params: any = {}

      if (tipo_passagem) {
        query += ` AND v.TIPO_VOO = :tipo_passagem`
        params.tipo_passagem = tipo_passagem
      }
      if (data_ida && data_retorno) {
        query += ` AND v.DATA_VOO BETWEEN TO_DATE(:data_ida, 'YYYY-MM-DD') AND TO_DATE(:data_retorno, 'YYYY-MM-DD')`
        params.data_ida = data_ida
        params.data_retorno = data_retorno
      }
      if (origem) {
        query += ` AND origem.CIDADE_AERO = :origem`
        params.origem = origem
      }
      if (destino) {
        query += ` AND destino.CIDADE_AERO = :destino`
        params.destino = destino
      }

      const result = await connection.execute(query, params)

      if (!result.rows || result.rows.length === 0 || !result.metaData) {
        res
          .status(404)
          .send('Nenhum voo encontrado com os critérios fornecidos.')
        return
      }

      const metaData = result.metaData.map((column: any) =>
        column.name.toLowerCase()
      )
      const formattedResult = result.rows.map((row: any) => {
        const formattedRow: any = {}
        metaData.forEach((column: string, index: number) => {
          formattedRow[column] = row[index]
        })
        return formattedRow
      })

      res.json(formattedResult)
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao buscar voos')
    } finally {
      if (connection) {
        try {
          await connection.close()
        } catch (err) {
          console.error(err)
        }
      }
    }
  })
}
