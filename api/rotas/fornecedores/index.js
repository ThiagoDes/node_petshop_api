const roteador = require('express').Router()
const TabelaFornecedor = require('./TabelaFornecedor')
const Fornecedor = require('./Fornecedor')
const SerializadorFornecedor = require('../../Serializador').SerializadorFornecedor

roteador.get('/', async (requisicao, resposta) => {
    const resultados = await TabelaFornecedor.listar()
    resposta.status(200)
    const Serializador = new SerializadorFornecedor(
        resposta.getHeader('Content-type')
    )
    resposta.send(
        Serializador.Serializar(resultados)
    )
})

roteador.post('/', async (requisicao, resposta, proximo) => {
    try {
        const dadosRecebidos = requisicao.body
        const fornecedor = new Fornecedor(dadosRecebidos)
        await fornecedor.criar()
        resposta.status(201)
        const Serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-type')
        )
        resposta.send(
            Serializador.Serializar(fornecedor)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.get('/:id', async (requisicao, resposta, proximo) => {
   try {
        const id = requisicao.params.id
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.detalhar()
        resposta.status(200)
        const Serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-type'),
            ['email', 'dataCriacao', 'dataAtualizacao', 'versao']
        )
        resposta.send(
            Serializador.Serializar(fornecedor)
        )
    } catch (erro) {
        proximo(erro)
    }
})

roteador.put('/:id', async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.id
        const dadosRecebidos = requisicao.body
        const dados = Object.assign({}, dadosRecebidos, { id: id })
        const fornecedor = new Fornecedor(dados)
        await fornecedor.atualizar()
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
 })

 roteador.delete('/:id', async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.id
        const fornecedor = new Fornecedor({ id: id })
        await fornecedor.detalhar(id)
        await fornecedor.remover()
        resposta.status(204)
        resposta.end()
    } catch (erro) {
        proximo(erro)
    }
 })

module.exports = roteador