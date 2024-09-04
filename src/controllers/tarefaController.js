import Tarefa from "../models/tarefaModel.js"
import { z } from "zod";
import formatZodError from "../helpers/zodError.js";

//validações com ZOD
const createSchema = z.object({
    tarefa:z
    .string()
    .min(3, {message: "A tarefa deve ter pelo menos 3 caracteres}"})
    .transform((txt) => txt.toLowerCase()),

    descricao: z.string()
    .min(5, {message: "A descricao deve ter pelo menos 5 caracteres"})
})

// export const getAll = async (request, response)=>{
//     try{
//         const tarefas = await Tarefa.findAll()
//         response.status(200).json(tarefas)
//     } catch (error){
//         response.status(500).json({message: "Erro ao listar tarefas"})
//     }
// };

//tarefas?page=2&limit=10

const burcarTarefaPorSituacaoSchema = z.object({
    situacao: z.enum(["pendente", "concluida"])
})

const updateTarefaSchema = z.object({
    terafa: z.string().min(3, {message: "A tarefa deve conter pelo menos 3 caracteres"}).transform((txt)=>txt.toLowerCase),
    descricao: z.string().min(5, {message: "A tarefa deve conter pelo menos 5 caracteres"}).transform((txt)=>txt.toLowerCase),
    situacao: z.enum(["pendente", "concluida"])
})

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
//implementar a validacao
const bodyValitation = createSchema.safeParse(request.body)
if(!bodyValitation.success){
    response.status(400).json({message: "Os dados recebidos do corpo da aplicação são inválidos",
        detalhes: bodyValitation.error
    })
    return
}


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
        const tarefa = await Tarefa.findOne({where: {id}});
        if(tarefa === null){
            response.status(404).json({message: "Tarefa não encontrada"})
            return
        }
        response.status(200).json(tarefa)
    } catch (error) {
        response.status(500).json({message: "Erro ao buscar tarefa"})
    }
}

export const updateTarefa = async (request, response)=>{
    const paramValidator = getSchema.safeParse(request.params);
    if(!paramValidator.success){
        response.status(400).json({
            message: "Numero de identificação está inválido",
            detalhes: formatZodError(paramValidator.error),
        })
        return
    }

    const updateValidator = updateTarefaSchema.safeParse(request.body)

    const {id} = request.params
    const {tarefa, descricao, status} = request.body

    const tarefaAtualizada = {
        tarefa,
        descricao,
        status
    }

    try {
        await Tarefa.update(tarefaAtualizada, {where: {id}});
        response.status(200).json({message: "Tarefa atualizada"});
    } catch (error) {
        response.status(500).json({message: "Erro ao atualizar tarefa"});
    }
}

export const updateStatusTarefa = async (request, response)=>{
    const paramValidator = getSchema.safeParse(request.params);
    if(!paramValidator.success){
        response.status(400).json({
            message: "Numero de identificação está inválido",
            detalhes: formatZodError(paramValidator.error),
        })
        return
    }

    const {id} = request.params;

    try {
        const tarefa = await Tarefa.findOne({raw: true, where:{id}})
        if(tarefa === null){
            response.status(404).json({message: "Tarefa não encontrada"});
            return;
        }
        if (tarefa.status === "pendente") {
            await Tarefa.update({status: "concluida"}, {where: {id}})
        } else if (tarefa.status === "concluida") {
            await Tarefa.update({status: "pendente"}, {where: {id}})
        }
        const tarefaAtualizada = await Tarefa.findOne({raw: true, where: {id}})^
        response.status(200).json(tarefaAtualizada)
    } catch (error) {
        console.error(error)
        response.status(500).json({err: "Erro ao atualizar tarefa"})
    }
};

export const burcarTarefaPorSituacao = async (request, response) =>{
const situacaoValidation = burcarTarefaPorSituacaoSchema.safeParse(request.params)
if(!situacaoValidation.success){
    response.status(400).json({
        message: "Situação inválida",
        details: formatZodError(situacaoValidation.error)
    })
    return
}

    const {situacao} = request.params;

    if(situacao !== "pendente" && situacao !== "concluida"){
        response.status(400).json({message: "Situação inválida! Use 'pendente' ou 'concluida'"});
        return
    }

    try {
        const tarefas = await Tarefa.findAll({
            where: {status: situacao},
                raw: true,
        });
        response.status(200).json(tarefas);
    } catch (error) {
        response.status(500).json({err: "Erro ao buscar tarefas"})
    }
}