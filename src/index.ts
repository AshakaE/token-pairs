import express from 'express'

const app = express()
const port: number = 1004

app.listen(port, (): void => {
    console.log(`Server listening on port ${port}`)
})