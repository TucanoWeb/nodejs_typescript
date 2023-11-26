import { Request, Response, Express } from 'express'
import oracledb, { ConnectionAttributes } from 'oracledb'

export default function setupDadosPag(
  app: Express,
  dbConfig: ConnectionAttributes
) {
  app.get('/dados-pagamento', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute('SELECT * FROM DADOS_PAG')

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
      res.status(500).send('Erro ao listar dados de pagamento')
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

  app.post('/dados-pagamento', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const {
        COD_PAG,
        ID_COMP,
        PASS_PAG,
        VALOR_PAG,
        EMAIL_PAG,
        FK_PASSAGEM_COD_PASS,
      } = req.body

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        `INSERT INTO DADOS_PAG (COD_PAG, ID_COMP, PASS_PAG, VALOR_PAG, EMAIL_PAG, FK_PASSAGEM_COD_PASS) 
        VALUES (:COD_PAG, :ID_COMP, :PASS_PAG, :VALOR_PAG, :EMAIL_PAG, :FK_PASSAGEM_COD_PASS)`,
        {
          COD_PAG,
          ID_COMP,
          PASS_PAG,
          VALOR_PAG,
          EMAIL_PAG,
          FK_PASSAGEM_COD_PASS,
        },
        { autoCommit: true }
      )

      res.status(201).send('Dados de pagamento adicionados com sucesso')
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao adicionar dados de pagamento')
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

  app.put('/dados-pagamento/:id', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const COD_PAG = req.params.id
      const { ID_COMP, PASS_PAG, VALOR_PAG, EMAIL_PAG, FK_PASSAGEM_COD_PASS } =
        req.body

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        `UPDATE DADOS_PAG 
        SET ID_COMP = :ID_COMP,
            PASS_PAG = :PASS_PAG,
            VALOR_PAG = :VALOR_PAG,
            EMAIL_PAG = :EMAIL_PAG,
            FK_PASSAGEM_COD_PASS = :FK_PASSAGEM_COD_PASS
        WHERE COD_PAG = :COD_PAG`,
        {
          COD_PAG,
          ID_COMP,
          PASS_PAG,
          VALOR_PAG,
          EMAIL_PAG,
          FK_PASSAGEM_COD_PASS,
        },
        { autoCommit: true }
      )

      if (result.rowsAffected && result.rowsAffected === 1) {
        res.status(200).send('Dados de pagamento atualizados com sucesso')
      } else {
        res.status(404).send('Dados de pagamento não encontrados')
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao atualizar dados de pagamento')
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

  app.delete('/dados-pagamento/:id', async (req: Request, res: Response) => {
    let connection: oracledb.Connection | undefined

    try {
      const COD_PAG = req.params.id

      connection = await oracledb.getConnection(dbConfig)

      const result = await connection.execute(
        'DELETE FROM DADOS_PAG WHERE COD_PAG = :COD_PAG',
        [COD_PAG],
        { autoCommit: true }
      )

      if (result.rowsAffected && result.rowsAffected === 1) {
        res.status(200).send('Dados de pagamento removidos com sucesso')
      } else {
        res.status(404).send('Dados de pagamento não encontrados')
      }
    } catch (err) {
      console.error(err)
      res.status(500).send('Erro ao remover dados de pagamento')
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
