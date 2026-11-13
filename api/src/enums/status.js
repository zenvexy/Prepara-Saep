const listar = async (req, res) => {

    const lista = [
        "A_FAZER",
        "FAZENDO",
        "PRONTO"
    ]; 

    res.status(200).json(lista);
};

module.exports = {
    listar
};