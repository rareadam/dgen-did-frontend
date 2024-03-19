export const DidAccountLinkRegistryAbi = [
  {
    "inputs": [],
    "name": "InvalidInitialization",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInitializing",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "purpose",
        "type": "string"
      }
    ],
    "name": "LinkedAccountRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "purpose",
        "type": "string"
      }
    ],
    "name": "LinkedAccountRemoved",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DEPOSIT_PER_LINKED_ACCOUNT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "authorizationChecker",
    "outputs": [
      {
        "internalType": "contract IDidAuthorizationChecker",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getDidByLinkedAccount",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      }
    ],
    "name": "getLinkedAccounts",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "purpose",
            "type": "string"
          }
        ],
        "internalType": "struct LinkedAccount[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_sudo",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_depositToken",
        "type": "address"
      },
      {
        "internalType": "contract IDidAuthorizationChecker",
        "name": "_authorizationChecker",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "linkedAccountsByDid",
    "outputs": [
      {
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "purpose",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "linkedDidByAccount",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "purpose",
        "type": "string"
      },
      {
        "internalType": "bytes",
        "name": "signature",
        "type": "bytes"
      }
    ],
    "name": "registerLinkedAccount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "id",
        "type": "string"
      }
    ],
    "name": "removeLinkedAccount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sudo",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
export const DidKeyRegistryAbi = [
  {
    "inputs": [],
    "name": "InvalidInitialization",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInitializing",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "DepositLocked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "DepositUnlocked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "enum KeyType",
        "name": "keyType",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "bytes32[]",
        "name": "keyUsages",
        "type": "bytes32[]"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "publicKey",
        "type": "bytes"
      }
    ],
    "name": "DidKeyAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "id",
        "type": "string"
      }
    ],
    "name": "DidKeyRevoked",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isSudo",
        "type": "bool"
      }
    ],
    "name": "DidKeySudoChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "keyUsage",
        "type": "bytes32"
      }
    ],
    "name": "DidKeyUsageAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "keyUsage",
        "type": "bytes32"
      }
    ],
    "name": "DidKeyUsageRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "did",
        "type": "address"
      }
    ],
    "name": "DidRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "did",
        "type": "address"
      }
    ],
    "name": "DidRemoved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DEPOSIT_PER_KEY",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "enum KeyType",
            "name": "keyType",
            "type": "uint8"
          },
          {
            "internalType": "bytes32[]",
            "name": "keyUsages",
            "type": "bytes32[]"
          },
          {
            "internalType": "bytes",
            "name": "publicKey",
            "type": "bytes"
          },
          {
            "internalType": "bool",
            "name": "sudo",
            "type": "bool"
          }
        ],
        "internalType": "struct Key",
        "name": "key",
        "type": "tuple"
      }
    ],
    "name": "addKey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "keyUsage",
        "type": "bytes32"
      }
    ],
    "name": "addKeyUsage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "key",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "keyUsage",
        "type": "bytes32"
      }
    ],
    "name": "checkAuthorization",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "deletedDids",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      }
    ],
    "name": "didExists",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "didKeys",
    "outputs": [
      {
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "internalType": "enum KeyType",
        "name": "keyType",
        "type": "uint8"
      },
      {
        "internalType": "bytes",
        "name": "publicKey",
        "type": "bytes"
      },
      {
        "internalType": "bool",
        "name": "sudo",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      }
    ],
    "name": "getKeys",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "enum KeyType",
            "name": "keyType",
            "type": "uint8"
          },
          {
            "internalType": "bytes32[]",
            "name": "keyUsages",
            "type": "bytes32[]"
          },
          {
            "internalType": "bytes",
            "name": "publicKey",
            "type": "bytes"
          },
          {
            "internalType": "bool",
            "name": "sudo",
            "type": "bool"
          }
        ],
        "internalType": "struct Key[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_sudo",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_depositToken",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "enum KeyType",
            "name": "keyType",
            "type": "uint8"
          },
          {
            "internalType": "bytes32[]",
            "name": "keyUsages",
            "type": "bytes32[]"
          },
          {
            "internalType": "bytes",
            "name": "publicKey",
            "type": "bytes"
          },
          {
            "internalType": "bool",
            "name": "sudo",
            "type": "bool"
          }
        ],
        "internalType": "struct Key[]",
        "name": "keys",
        "type": "tuple[]"
      }
    ],
    "name": "registerDid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      }
    ],
    "name": "removeDid",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "keyUsage",
        "type": "bytes32"
      }
    ],
    "name": "removeKeyUsage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "id",
        "type": "string"
      }
    ],
    "name": "revokeKey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "id",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isSudo",
        "type": "bool"
      }
    ],
    "name": "setSudoKey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sudo",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
export const DidNameRegistryAbi = [
  {
    "inputs": [],
    "name": "InvalidInitialization",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInitializing",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "registrant",
        "type": "address"
      }
    ],
    "name": "NameRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "NameUnregistered",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "authorizationChecker",
    "outputs": [
      {
        "internalType": "contract IDidAuthorizationChecker",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "getDidForName",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      }
    ],
    "name": "getNameForDid",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_sudo",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_depositToken",
        "type": "address"
      },
      {
        "internalType": "contract IDidAuthorizationChecker",
        "name": "_authorizationChecker",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "registerName",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sudo",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      }
    ],
    "name": "unregisterName",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
export const DidServiceAccountRegistryAbi = [
  {
    "inputs": [],
    "name": "InvalidInitialization",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInitializing",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "id",
        "type": "string"
      }
    ],
    "name": "ServiceAccountRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "id",
        "type": "string"
      }
    ],
    "name": "ServiceAccountRemoved",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "DEPOSIT_PER_SERVICE_ACCOUNT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "authorizationChecker",
    "outputs": [
      {
        "internalType": "contract IDidAuthorizationChecker",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "depositToken",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      }
    ],
    "name": "getServiceAccounts",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "types",
            "type": "string[]"
          },
          {
            "internalType": "string[]",
            "name": "endpoints",
            "type": "string[]"
          }
        ],
        "internalType": "struct ServiceAccount[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_sudo",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "_depositToken",
        "type": "address"
      },
      {
        "internalType": "contract IDidAuthorizationChecker",
        "name": "_authorizationChecker",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "types",
            "type": "string[]"
          },
          {
            "internalType": "string[]",
            "name": "endpoints",
            "type": "string[]"
          }
        ],
        "internalType": "struct ServiceAccount[]",
        "name": "accounts",
        "type": "tuple[]"
      }
    ],
    "name": "registerServiceAccount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "did",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "id",
        "type": "string"
      }
    ],
    "name": "removeServiceAccount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "serviceAccounts",
    "outputs": [
      {
        "internalType": "string",
        "name": "id",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sudo",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
export const FaucetAbi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_dripAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_blockInterval",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "blockInterval",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "dripAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "lastAccessTime",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "requestTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
