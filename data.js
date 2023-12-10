import { PutItemCommand, GetItemCommand, QueryCommand, BatchWriteItemCommand, DeleteItemCommand, UpdateItemCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import bcrypt from 'bcryptjs'

const client = new DynamoDBClient({
  region: 'us-east-1',
});

export async function verifyExistingUser(username) {
  const input = {
    "Key": {
      "PK": {
        "S": "BRAND#STARLUMA"
      },
      "SK": {
        "S": "USER#" + username.toString()
      }
    },
    "TableName": "clothingStore"
  }
  const command = new GetItemCommand(input)
  const response = await client.send(command)
  return "Item" in response
}

export async function addNewUser(userData) {
  const input = {
    "ExpressionAttributeValues": {
      ":sk": {
        "S": "USER#"
      },
      ":pk": {
        "S": "BRAND#STARLUMA"
      }
    },
    "KeyConditionExpression": "PK = :pk and begins_with(SK, :sk)",
    "TableName": "clothingStore"
  }
  const command = new QueryCommand(input)
  const res = await client.send(command)

  const password = await bcrypt.hash(userData.password, 10);

  const cmd = new PutItemCommand({
    "Item": {
      "PK": {
        "S": "BRAND#STARLUMA"
      },
      "SK": {
        "S": "USER#" + userData.username
      },
      "email": {
        "S": userData.email
      },
      "username": {
        "S": userData.username
      },
      "password": {
        "S": password
      },
      "gender": {
        "S": userData.gender
      },
      "userId": {
        "N": (res.Count + 1).toString()
      },
    },
    "TableName": "clothingStore",
  });
  const response = await client.send(cmd)
  return [response, res.Count + 1]
}

export async function logIn(userData) {
  const input = {
    "Key": {
      "PK": {
        "S": "BRAND#STARLUMA"
      },
      "SK": {
        "S": "USER#" + userData.username
      }
    },
    "ProjectionExpression": "userId, username, password",
    "TableName": "clothingStore"
  }
  const command = new GetItemCommand(input)
  const response = await client.send(command)
  if (!("Item" in response)) {
    return [false]
  }
  const passwordCompare = await bcrypt.compare(userData.password, response.Item.password.S)
  return [passwordCompare, response.Item.userId.N];
}

function toDynamoDBList(array) {
  let index = 1;
  let arrayObject = {};
  let arrayString = "";
  array.forEach((element) => {
    arrayString = arrayString + ":itemID" + index.toString() + ", "
    arrayObject[":itemID" + index.toString()] = {"N": element}
    index++
  })
  return [arrayObject, arrayString.slice(0, -2)]
}

export async function getItemInCart(userId) {
  const input = {
    "ExpressionAttributeValues": {
      ":sk": {
        "S": "CART#"
      },
      ":pk": {
        "S": "BRAND#STARLUMA"
      },
      ":usID": {
        "N": userId.toString()
      }
    },
    "KeyConditionExpression": "PK = :pk and begins_with(SK, :sk)",
    "FilterExpression": "userId = :usID",
    "ProjectionExpression": "id, qty",
    "TableName": "clothingStore"
  };
  const command = new QueryCommand(input)
  const response = await client.send(command)
  if (!("Items" in response) || response.Items.length === 0) {
    return false
  }

  const cartItemId = response.Items.map((x) => x.id.N)
  const cartQty = response.Items.map((x) => x.qty.N)
  const cartItemIdDynamoDB = toDynamoDBList(cartItemId)
  const expressionAttributeValues = {
    ":sk": {
      "S": "SHOES#"
    },
    ":pk": {
      "S": "BRAND#STARLUMA"
    }
  }

  const input2 = {
    "ExpressionAttributeValues": {
      ...cartItemIdDynamoDB[0], ...expressionAttributeValues
    },
    "KeyConditionExpression": "PK = :pk and begins_with(SK, :sk)",
    "FilterExpression": "id IN (" + cartItemIdDynamoDB[1] + ")",
    "TableName": "clothingStore"
  };
  const command2 = new QueryCommand(input2)
  const response2 = await client.send(command2)

  let counter = 0
  let finalResponse = [];
  response2.Items.forEach((x) => {
    finalResponse.push({
      ...x,
      qty: Number(cartQty[counter])
    })
    counter++
  })
  return finalResponse
}

export async function addItemInCart(itemData) {
  const cmd = new PutItemCommand({
    "Item": {
      "PK": {
        "S": "BRAND#STARLUMA"
      },
      "SK": {
        "S": "CART#" + itemData.itemId + "#" + itemData.userId
      },
      "id": {
        "N": itemData.itemId
      },
      "userId": {
        "N": itemData.userId
      },
      "qty": {
        "N": "1"
      }
    },
    "TableName": 'clothingStore',
  });
  const response = await client.send(cmd)
  return response
}

export async function deleteAllItemInCart(itemDataIdList, userId) {
  let deleteRequests = []
  itemDataIdList.forEach(element => {
    deleteRequests.push({
      "DeleteRequest": {
        "Key": {
          "PK": {
            "S": "BRAND#STARLUMA"
          },
          "SK": {
            "S": "CART#" + element + "#" + userId
          }
        }
      }
    })
  });
  const input = {
    "RequestItems": {
      "clothingStore": deleteRequests
    },
    "ReturnedConsumedCapacity": "TOTAL"
  };
  const cmd = new BatchWriteItemCommand(input)
  const response = await client.send(cmd)
  return response
}

export async function deleteOneItemInCart(cartData) {
  const input = {
    "Key": {
      "PK": {
        "S": "BRAND#STARLUMA"
      },
      "SK": {
        "S": "CART#" + cartData.itemId + "#" + cartData.userId
      }
    },
    "TableName": "clothingStore"
  };
  const cmd = new DeleteItemCommand(input)
  const response = await client.send(cmd)
  return response
}

export async function getAllClothing() {
  const input = {
    "TableName": "clothingStore",
    "KeyConditionExpression": "PK = :pk and begins_with(SK, :sk)",
    "ExpressionAttributeValues": {
      ":pk": {
        "S": "BRAND#STARLUMA"
      },
      ":sk": {
        "S": "SHOES#"
      }
    },
  }
  const command = new QueryCommand(input)
  const response = client.send(command)
  return response
}

export async function updateCartQty(cartItemInfo) {
  const newQty = () => {if (cartItemInfo.operation === "add") {
    return (Number(cartItemInfo.qty) + 1).toString()
} else {
  return (Number(cartItemInfo.qty) - 1).toString()
}
}
  const input = {
    "ExpressionAttributeNames": {
      "#Q": "qty"
    },
    "ExpressionAttributeValues": {
      ":q": {
        "N": newQty()
      }
    },
    "Key": {
      "PK": {
        "S": "BRAND#STARLUMA"
      },
      "SK": {
        "S": "CART#" + cartItemInfo.itemId + "#" + cartItemInfo.userId
      }
    },
    "TableName": "clothingStore",
    "UpdateExpression": "SET #Q = :q"
  }
  const command = new UpdateItemCommand(input)
  const response = await client.send(command)
  return response
}

// console.log(await updateCartQty({
//   qty: 1,
//   operation: "add",
//   itemId: '473391',
//   userId: '1'
// }))

// console.log(await getAllClothing().then(
//   (res) => {
//     return res.Items[0].gender.SS[0]
//   }
// ))

// function addNewOpinion(topicId, opinionData) {
//   const cmd = new PutCommand({
//     Item: {
//       TopicId: topicId,
//       CreationDate: new Date().toISOString(),
//       Title: opinionData.title,
//       User: opinionData.user,
//       Text: opinionData.text,
//     },
//     TableName: 'Opinions',
//   });
//   return ddbDocClient.send(cmd);
// }

// async function getTopics() {
//   const cmd = new ScanCommand({
//     TableName: 'Topics',
//   });

//   const response = await ddbDocClient.send(cmd);
//   const items = response.Items;
//   console.log(items);

//   return items.map((item) => ({
//     title: item.Title,
//     user: item.User,
//     id: item.Id,
//     statement: item.Statement,
//   }));
// }

// async function getTopic(id) {
//   const cmd = new GetCommand({
//     Key: {
//       Id: id,
//     },
//     TableName: 'Topics',
//   });

//   const response = await ddbDocClient.send(cmd);
//   const topicData = response.Item;

//   const cmd2 = new QueryCommand({
//     KeyConditions: {
//       TopicId: {
//         AttributeValueList: [id],
//         ComparisonOperator: 'EQ'
//       },
//     },
//     TableName: 'Opinions',
//   });

//   const response2 = await ddbDocClient.send(cmd2);
//   const opinions = response2.Items;

//   const topic = {
//     id: topicData.Id,
//     title: topicData.Title,
//     statement: topicData.Statement,
//     user: topicData.User,
//     opinions: opinions.map((opinion) => ({
//       id: opinion.TopicId + opinion.CreationDate,
//       title: opinion.Title,
//       user: opinion.User,
//       text: opinion.Text,
//     })),
//   };

//   return topic;
// }

