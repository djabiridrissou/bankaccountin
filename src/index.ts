import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "./data-source";
import express from "express";
import apiRouter from "./route/index.route";
import bodyParser from "body-parser";
const PORT = 3890

const cors = require('cors')
const allowlist = ['http://localhost:3890']

const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (allowlist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

AppDataSource.initialize().then(async () => {
    console.log("Datasource successfully initialized")
}).catch((error => {
    console.log(error)
}))

const app = express()

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
app.use(express.json())

app.listen(PORT, () => {
    console.log(`Node server has started on port ${PORT}`)
})

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        message: 'myBank ;-)'
    })
})

app.use('/bank', cors(corsOptions), apiRouter)

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    return res.status(500).json({
        success: false,
        name: error.message
    })
})