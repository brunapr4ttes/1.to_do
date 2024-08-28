import Tarefa from "../models/tarefaModel.js"

// export const getAll = async (request, response)=>{
//     try{
//         const tarefas = await Tarefa.findAll()
//         response.status(200).json(tarefas)
//     } catch (error){
//         response.status(500).json({message: "Erro ao listar tarefas"})
//     }
// };

//tarefas?page=2&limit=10
export const getAll = async (request, response)=>{
    const page = parseInt(request.query.page) || 1;
    const limit =  parseInt(request.query.limit) || 10;
    const offset = (page - 1) * limit
    try {
        const tarefas = await Tarefa.findAndCountAll({
            limit, 
            offset
        });
        const totalPaginas = Math.ceil(tarefas.count / limit);
        response.status(200).json({
            totalTarefas: tarefas.count, 
            totalPaginas,
            paginaAtual: page,
            itensPorPagina: limit,
            proximaPagina: totalPaginas === 0 ? null : `http://localhost:3333/tarefas?page=${page + 1}`,
            tarefas: tarefas.rows
        });
    } catch (error) {
        console.error(error);
        response.status(500).json({message: "Erro ao buscar tarefas"})
    }
}

export const create = async (request, response)=>{
    const {tarefa, descricao} = request.body
    const  status = "pendente" 
    if(!tarefa){
        response.status(400).json({err: "A tarefa é obrigatória"})
        return
    }
    if(!descricao){
        response.status(400).json({err: "A descrição é obrigatória"})
        return
    }

    const novaTarefa = {
        tarefa, 
        descricao,
        status
    }

    try {
        await Tarefa.create(novaTarefa)
        response.status(201).json({message: "Tarefa cadastrada"})
    } catch (error) {
        console.error(error)
        response.status(500).json({message: "Erro ao cadastrar nova tarefa"})
    }
}

export const getTarefa = async (request, response)=>{
    const {id} = request.params

    try {
        const tarefa = await Tarefa.findByPk(id)
        response.status(200).json(tarefa)
    } catch (error) {
        response.status(500).json({message: "Erro ao buscar tarefa"})
    }
}