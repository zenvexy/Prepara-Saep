const listar = async (req, res) => {

    const lista = [
        "BAIXA",
        "MEDIA",
        "ALTA"
    ]; 

    res.status(200).json(lista);
};

module.exports = {
    listar
};