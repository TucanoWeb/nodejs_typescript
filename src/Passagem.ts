import { Request, Response, Express } from 'express'
import oracledb, { ConnectionAttributes } from 'oracledb'

export default function setupPassagem(
  app: Express,
  dbConfig: ConnectionAttributes
) {
  app.get('/passagens', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute('SELECT * FROM PASSAGEM')

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

  app.post('/passagens', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const {
        COD_PASS,
        TIPO_PASS,
        COD_ASSENTOS,
        FK_VOOS_COD_VOO,
        FK_AVIOES_ID_AV,
        FK_AEROPORTOS_COD_AERO,
      } = req.body

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        `INSERT INTO PASSAGEM (COD_PASS, TIPO_PASS, COD_ASSENTOS, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV, FK_AEROPORTOS_COD_AERO) 
        VALUES (:COD_PASS, :TIPO_PASS, :COD_ASSENTOS, :FK_VOOS_COD_VOO, :FK_AVIOES_ID_AV, :FK_AEROPORTOS_COD_AERO)`,
        {
          COD_PASS,
          TIPO_PASS,
          COD_ASSENTOS,
          FK_VOOS_COD_VOO,
          FK_AVIOES_ID_AV,
          FK_AEROPORTOS_COD_AERO,
        },
        { autoCommit: true }
      )

      res.status(201).send('Passagem adicionada com sucesso')
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao adicionar passagem')
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

  app.put('/passagens/:id', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const COD_PASS = req.params.id
      const {
        TIPO_PASS,
        COD_ASSENTOS,
        FK_VOOS_COD_VOO,
        FK_AVIOES_ID_AV,
        FK_AEROPORTOS_COD_AERO,
      } = req.body

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        `UPDATE PASSAGEM 
        SET TIPO_PASS = :TIPO_PASS,
            COD_ASSENTOS = :COD_ASSENTOS,
            FK_VOOS_COD_VOO = :FK_VOOS_COD_VOO,
            FK_AVIOES_ID_AV = :FK_AVIOES_ID_AV,
            FK_AEROPORTOS_COD_AERO = :FK_AEROPORTOS_COD_AERO
        WHERE COD_PASS = :COD_PASS`,
        {
          COD_PASS,
          TIPO_PASS,
          COD_ASSENTOS,
          FK_VOOS_COD_VOO,
          FK_AVIOES_ID_AV,
          FK_AEROPORTOS_COD_AERO,
        },
        { autoCommit: true }
      )

      if (result.rowsAffected && result.rowsAffected === 1) {
        res.status(200).send('Passagem atualizada com sucesso')
      } else {
        res.status(404).send('Passagem não encontrada')
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao atualizar passagem')
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

  app.delete('/passagens/:id', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const COD_PASS = req.params.id

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        'DELETE FROM PASSAGEM WHERE COD_PASS = :COD_PASS',
        [COD_PASS],
        { autoCommit: true }
      )

      if (result.rowsAffected && result.rowsAffected === 1) {
        res.status(200).send('Passagem removida com sucesso')
      } else {
        res.status(404).send('Passagem não encontrada')
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao remover passagem')
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
