# Ticketing

## How to use

1. Clone to your machine
2. cd into folder
3. create a necessary secret in the environment:

```shell
  kubectl create secret generic <NAME_OF_SECRET> --from-literal=<KEY>=<VALUE>
```

4. run `skaffold dev` in the root

## Notes

[Link to Notion page](https://www.notion.so/Running-Services-with-Docker-Kubernetes-ccf84b93a9a14309b8e8ef354a2642ca?pvs=4)
