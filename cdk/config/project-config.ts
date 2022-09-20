const config_file = require("./project-config.json");

export type BatchServiceConfig = {
    ecrRepoArn: string,
    imageTag: string,
    jobvCpus: string,
    jobMemory: string,
    computeEnvMaxvCpus: number
}

export type ProjectConfig = {
    batchService: BatchServiceConfig
}

const config = <ProjectConfig>config_file

export default config

