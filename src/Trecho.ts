import express, { Request, Response, Express } from 'express'
import oracledb from 'oracledb'
import { dbConfig } from './config/db'

export default function setupTrechos(app: Express) {
  app.post('/trechos', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const { origem_aeroporto, destino_aeroporto } = req.body

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        'INSERT INTO TRECHO ( origem_aeroporto, destino_aeroporto) VALUES (: origem_aeroporto, :destino_aeroporto)',
        { origem_aeroporto, destino_aeroporto },
        { autoCommit: true }
      )

      console.log({ result })

      res.status(201).send('Trechobadicionado com sucesso')
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao adicionar trecho')
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

  app.put('/trechos/:id', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const trechosId = req.params.id
      const { origem_aeroporto, destino_aeroporto } = req.body

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        'UPDATE TRECHO SET origem_aeroporto = :origem_aeroporto, :destino_aeroporto = destino_aeroporto WHERE id = :trechosIdId',
        { origem_aeroporto, destino_aeroporto, trechosId },
        { autoCommit: true }
      )

      console.log({ result })

      if (result.rowsAffected && result.rowsAffected === 1) {
        res.status(200).send('Trecho atualizada com sucesso')
      } else {
        res.status(404).send('Trecho não encontrada')
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao atualizar trecho')
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

  app.delete('/trechos/:id', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const aeroportoId = req.params.id

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        'DELETE FROM TRECHO WHERE id = :trechoId',
        [setupTrechos],
        { autoCommit: true }
      )

      console.log({ result })

      if (result.rowsAffected && result.rowsAffected === 1) {
        res.status(200).send('Trecho removido com sucesso')
      } else {
        res.status(404).send('Trecho não encontrado')
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao remover trecho')
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

  app.get('/trechos', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute('SELECT * FROM TRECHO')

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
}
