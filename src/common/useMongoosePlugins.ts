import { applyDecorators } from '@nestjs/common';
import { plugin } from '@typegoose/typegoose';
import autopopulate from 'mongoose-autopopulate';

export const useMongoosePlugins = () => applyDecorators(plugin(autopopulate));
