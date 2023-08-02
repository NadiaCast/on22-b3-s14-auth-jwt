const mongoose = require ("mongoose")
const colaboralorasSchema = new mongoose.Schema(
    {
    nome: {
        type: "String"
    },
    email:{
        type: "String"
    },
    senha:{
        type: "String"
    }
},
{
    versionKey: false
}
)

const colaboradoras = mongoose.model("colaboradoras", colaboralorasSchema);

module.exports = colaboradoras
