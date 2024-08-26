import Tarefa from "../models/tarefaModel.js"

export const getAll = async (request, response)=>{
    try{
        const tarefas = await Tarefa.findAll()
        response.status(200).json(tarefas)
    } catch (error){
        response.status(500).json({message: "Erro ao listar tarefas"})
    }
};

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
