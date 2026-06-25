# Azure

Use Azure Blob Storage for durable visual assets.

- Single file: `az storage blob upload --container-name <container> --file <file> --name <name> --auth-mode login`
- Batch: `az storage blob upload-batch --destination <container> --source <dir> --auth-mode login`

Refs:

- https://learn.microsoft.com/en-us/cli/azure/storage/blob
- https://learn.microsoft.com/en-us/azure/storage/blobs/blob-cli
