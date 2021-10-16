import { Scalar, CustomScalar } from '@nestjs/graphql';
import { GraphQLJSONObject as json } from 'graphql-type-json';

@Scalar(GraphQLJSONObject.name, (type) => Object)
export class GraphQLJSONObject implements CustomScalar<string, any> {
  name = json.name;
  description = json.description;

  serialize = json.serialize;
  parseValue = json.parseValue;
  parseLiteral = json.parseLiteral;
}
