export type IEnvironment = {
  STAGE: {
    ID: string
    ACCOUNT: string
    REGION: string
  }

  // Definição de variáveis de exemplo.
  // Geralmente, criamos um bloco para cada uma de nossas stacks, mas
  //   este formato pode ser ajustado de acordo com a necessidade do seu projeto.
  MOBILE_API: {
    IMAGES_BUCKET: string
    REQUESTS_TABLE: string
  }

  WEB_API: {
    IMAGES_BUCKET: string
    REQUESTS_TABLE: string
  }

  QUEUE_LEARNING: {
    IMAGES_BUCKET: string
    REQUESTS_TABLE: string
  }
}
