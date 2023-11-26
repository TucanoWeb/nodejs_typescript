import { Request, Response, Express } from 'express'
import oracledb, { ConnectionAttributes } from 'oracledb'

export default function setupVoos(
  app: Express,
  dbConfig: ConnectionAttributes
) {
  app.get('/voos', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute('SELECT * FROM VOOS')

      if (!result.rows || !result.metaData) {
        res.status(500).send('Erro ao listar: Resultado não contém linhas.')
        return
      }

      const metaData = result.metaData.map((column: any) => column.name)
      const response = result.rows.map((row: any) => {
        const ret: any = {}
        metaData.forEach((key: string, index: number) => {
          ret[key] = row[index]
        })
        return ret
      })

      res.json(response)
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao listar')
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

  app.post('/voos', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const { COD_VOO, DATA_VOO, HORA_VOO, TIPO_VOO, TRECHO_VOO } = req.body

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        `INSERT INTO VOOS (COD_VOO, DATA_VOO, HORA_VOO, TIPO_VOO, TRECHO_VOO) 
        VALUES (:COD_VOO, TO_DATE(:DATA_VOO, 'YYYY-MM-DD'), :HORA_VOO, :TIPO_VOO, :TRECHO_VOO)`,
        { COD_VOO, DATA_VOO, HORA_VOO, TIPO_VOO, TRECHO_VOO },
        { autoCommit: true }
      )

      res.status(201).send('Voo adicionado com sucesso')
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao adicionar voo')
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

  app.put('/voos/:id', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const COD_VOO = req.params.id
      const { DATA_VOO, HORA_VOO, TIPO_VOO, TRECHO_VOO } = req.body

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        `UPDATE VOOS 
        SET DATA_VOO = TO_DATE(:DATA_VOO, 'YYYY-MM-DD'),
            HORA_VOO = :HORA_VOO,
            TIPO_VOO = :TIPO_VOO,
            TRECHO_VOO = :TRECHO_VOO 
        WHERE COD_VOO = :COD_VOO`,
        { COD_VOO, DATA_VOO, HORA_VOO, TIPO_VOO, TRECHO_VOO },
        { autoCommit: true }
      )

      if (result.rowsAffected && result.rowsAffected === 1) {
        res.status(200).send('Voo atualizado com sucesso')
      } else {
        res.status(404).send('Voo não encontrado')
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao atualizar voo')
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

  app.delete('/voos/:id', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const COD_VOO = req.params.id

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        'DELETE FROM VOOS WHERE COD_VOO = :COD_VOO',
        [COD_VOO],
        { autoCommit: true }
      )

      if (result.rowsAffected && result.rowsAffected === 1) {
        res.status(200).send('Voo removido com sucesso')
      } else {
        res.status(404).send('Voo não encontrado')
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao remover voo')
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
