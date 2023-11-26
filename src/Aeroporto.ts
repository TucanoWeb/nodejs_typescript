import { Request, Response, Express } from 'express'
import oracledb, { ConnectionAttributes } from 'oracledb'

export default function setupAeroportos(
  app: Express,
  dbConfig: ConnectionAttributes
) {
  app.get('/aeroportos', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute('SELECT * FROM AEROPORTOS')

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

  app.post('/aeroportos', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const {
        COD_AERO,
        NOME_AERO,
        PAIS_AERO,
        CIDADE_AERO,
        FK_VOOS_COD_VOO,
        FK_AVIOES_ID_AV,
      } = req.body

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        `INSERT INTO AEROPORTOS (COD_AERO, NOME_AERO, PAIS_AERO, CIDADE_AERO, FK_VOOS_COD_VOO, FK_AVIOES_ID_AV) 
        VALUES (:COD_AERO, :NOME_AERO, :PAIS_AERO, :CIDADE_AERO, :FK_VOOS_COD_VOO, :FK_AVIOES_ID_AV)`,
        {
          COD_AERO,
          NOME_AERO,
          PAIS_AERO,
          CIDADE_AERO,
          FK_VOOS_COD_VOO,
          FK_AVIOES_ID_AV,
        },
        { autoCommit: true }
      )

      res.status(201).send('Aeroporto adicionado com sucesso')
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao adicionar aeroporto')
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

  app.put('/aeroportos/:id', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const COD_AERO = req.params.id
      const {
        NOME_AERO,
        PAIS_AERO,
        CIDADE_AERO,
        FK_VOOS_COD_VOO,
        FK_AVIOES_ID_AV,
      } = req.body

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        `UPDATE AEROPORTOS 
        SET NOME_AERO = :NOME_AERO,
            PAIS_AERO = :PAIS_AERO,
            CIDADE_AERO = :CIDADE_AERO,
            FK_VOOS_COD_VOO = :FK_VOOS_COD_VOO,
            FK_AVIOES_ID_AV = :FK_AVIOES_ID_AV 
        WHERE COD_AERO = :COD_AERO`,
        {
          COD_AERO,
          NOME_AERO,
          PAIS_AERO,
          CIDADE_AERO,
          FK_VOOS_COD_VOO,
          FK_AVIOES_ID_AV,
        },
        { autoCommit: true }
      )

      if (result.rowsAffected && result.rowsAffected === 1) {
        res.status(200).send('Aeroporto atualizado com sucesso')
      } else {
        res.status(404).send('Aeroporto não encontrado')
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao atualizar aeroporto')
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

  app.delete('/aeroportos/:id', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const COD_AERO = req.params.id

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        'DELETE FROM AEROPORTOS WHERE COD_AERO = :COD_AERO',
        [COD_AERO],
        { autoCommit: true }
      )

      if (result.rowsAffected && result.rowsAffected === 1) {
        res.status(200).send('Aeroporto removido com sucesso')
      } else {
        res.status(404).send('Aeroporto não encontrado')
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao remover aeroporto')
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
