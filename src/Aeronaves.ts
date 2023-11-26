import { Request, Response, Express } from 'express'
import oracledb, { ConnectionAttributes } from 'oracledb'



export default function setupAvioes(
  app: Express,
  dbConfig: ConnectionAttributes
) {
  app.get('/avioes', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute('SELECT * FROM AVIOES')


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

  app.post('/avioes', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const { ID_AV, ANO_AV, MODELO_AV, MAPA_ASSENTOS_AV, NUM_ASSENTOS_AV } =
        req.body

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        `INSERT INTO AVIOES (ID_AV, ANO_AV, MODELO_AV, MAPA_ASSENTOS_AV, NUM_ASSENTOS_AV) 
        VALUES (:ID_AV, :ANO_AV, :MODELO_AV, :MAPA_ASSENTOS_AV, :NUM_ASSENTOS_AV)`,
        { ID_AV, ANO_AV, MODELO_AV, MAPA_ASSENTOS_AV, NUM_ASSENTOS_AV },
        { autoCommit: true }
      )

      res.status(201).send('Avião adicionado com sucesso')
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao adicionar avião')
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

  app.put('/avioes/:id', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const ID_AV = req.params.id
      const { ANO_AV, MODELO_AV, MAPA_ASSENTOS_AV, NUM_ASSENTOS_AV } = req.body

      connection = await oracledb.getConnection(dbConfig)

      

      const result = await connection.execute(
        `UPDATE AVIOES 
        SET ANO_AV = :ANO_AV,
            MODELO_AV = :MODELO_AV,
            MAPA_ASSENTOS_AV = :MAPA_ASSENTOS_AV,
            NUM_ASSENTOS_AV = :NUM_ASSENTOS_AV
        WHERE ID_AV = :ID_AV`,
        { ID_AV, ANO_AV, MODELO_AV, MAPA_ASSENTOS_AV, NUM_ASSENTOS_AV },
        { autoCommit: true }
      )

      if (result.rowsAffected && result.rowsAffected === 1) {
        res.status(200).send('Avião atualizado com sucesso')
      } else {
        res.status(404).send('Avião não encontrado')
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao atualizar avião')
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

  app.delete('/avioes/:id', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const ID_AV = req.params.id

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        'DELETE FROM AVIOES WHERE ID_AV = :ID_AV',
        [ID_AV],
        { autoCommit: true }
      )

      if (result.rowsAffected && result.rowsAffected === 1) {
        res.status(200).send('Avião removido com sucesso')
      } else {
        res.status(404).send('Avião não encontrado')
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao remover avião')
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
