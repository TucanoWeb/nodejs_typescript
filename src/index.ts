import express from 'express'
import cors from 'cors'
import setupAeroaves from './Aeronaves'
import { dbConfig } from './config/db'
import setupVoos from './Voos'
import setupAeroportos from './Aeroporto'
import setupPassagem from './Passagem'
import setupDadosPag from './Pagamento'
import setupBuscaVoos from './Busca'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

setupAeroaves(app, dbConfig)
setupVoos(app, dbConfig)
setupAeroportos(app, dbConfig)
setupPassagem(app, dbConfig)
setupDadosPag(app, dbConfig)
setupBuscaVoos(app, dbConfig)

app.listen(port, () => {
  console.log(`Servidor está rodando na porta ${port}`)
})
