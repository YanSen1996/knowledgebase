import Debug from 'debug'

const modelDebugger = Debug('knowledgebase:model')

const controllerDebugger = str => Debug('knowledgebase:controller:' + str)

const middlewareDebugger = Debug('knowledgebase:middleware')

export { modelDebugger, controllerDebugger, middlewareDebugger }
