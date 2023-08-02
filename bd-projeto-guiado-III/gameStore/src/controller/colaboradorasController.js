const ColaboradorasModel = require("../models/colaboradorasModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const create = (req, res) => {
    const senhaComHash = bcrypt.hashSync(req.body.senha, 10)
    //transforma a senha em hash, embaralhado
    req.body.senha = senhaComHash
    //coloca a senha embaralhada

    const colaboradora = new ColaboradorasModel(req.body) //add ao modelo
    colaboradora.save(function (err) { //salva a nova colaboradora
        if (err) {
            res.status(500).send({
                message: err.message
            })
        }
        req.status(201).send(colaboradora.toJSON())
    })
}

const getAll = (req, res) => {
const authHeader = req.get("authorization") 
if(!authHeader) {
    return res.status(401).send("Cade o token")
}

const token = authHeader.split("")[1]

jwt.verify(token, SECRET, async function(erro){
    if(erro){
        return res.status(401).send("Acesso negado")
    }
    ColaboradorasModel.find(function (err, colaboradoras) {
        if (err) {
            res.satus(500).send({
                message: err.message
            })
        }
        res.satus(200).send(colaboradoras)
})
    
    })
}

const deleteById = async (req, res) => {
    try {
        const authHeader = req.get("authorization")

        if (!authHeader) {
            return res.status(401).send("Vocè esqueceu de passar um token")
        }

        const token = authHeader.split(" ")[1]

        jwt.verify(token, SECRET, async function (erro) {
            if (erro) {
                return res.status(403).send("Acesso não autorizado")
            }
            const { id } = req.params
            await colaboradoras.findByIdAndDelete(id)
            const message = "A colaboradora com o id: ${id} foi deletada"
            res.satus(200).json({
                message
            })
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: error.message
        })
    }
}

const login = (req, res) => {
    colaboradoras.findOne({ email: req.body.email }, function (error, colaboradora) {
        if (!colaboradoras) {
            return res.status(404).send("Não existe colaboradora com email ${req.body.email}")
        }
        {

            const senhaValida = bcrypt.compareSync(req.body.senha, colaboradora.senha)

            if (!senhaValida) {
                return res.status(403).send("Erro ao digitar a senha")
            }

            const token = jwt.sign({ email: req.body.email }, SECRET)
            return res.status(200).send(token)
        }
    })


}

module.exports = {
    create,
    getAll,
    deleteById,
    login
}