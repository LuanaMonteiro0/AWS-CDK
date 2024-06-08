# Primeiro projeto com CDK

Para fazer o primeiro deploy é preciso rodar o comando abaixo afim de carregar os dados necessários para futuros deploys do cdk.
Esse comando faz o "bootstraping" da conta, deixando ela habilitada para uso do cdk ao criar e gerenciar recursos

```
cdk bootstrap aws://{992382603478}/us-east-1 --cloudformation-execution-policies=arn:aws:iam::aws:policy/AdministratorAccess -c stage=dev
```

Para fazer deploy do codigo novo ou atualizado no ambiente da AWS é preciso executar o comando

```
cdk deploy -c stage=dev "dev/web-api-stack"
```

Para apagar todos os recursos que são "Apagaveis" da AWS use o comando

```
cdk destroy -c stage=dev "dev/web-api-stack"
```

Para testar as rotas de PUT e POST podemos usar o JSON

```
{
      "productId": "id_aqui",
      "title": "nome_produto_aqui"
}
```
