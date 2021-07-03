// 'use strict';

// /**
//  * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
//  * to customize this controller
//  */

// module.exports = {};

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');


module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.principal = ctx.state.user.id;
      entity = await strapi.services.teacher.create(data, { files });
    } else {
      ctx.request.body.principal = ctx.state.user.id;
      entity = await strapi.services.teacher.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.teacher });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [teacher] = await strapi.services.teacher.find({
      id: ctx.params.id,
      'principal.id': ctx.state.user.id,
    });

    if (!teacher) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.teacher.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.teacher.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.teacher });
  },
  async find(ctx) {
    let entities;
     
    if (ctx.query._q) {
    entities = await strapi.services.teacher.search({
    ...ctx.query,
    'principal.id': ctx.state.user.id
    });
    } else {
    entities = await strapi.services.teacher.find({
    ...ctx.query,
    'principal.id': ctx.state.user.id
    });
    }
     
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.teacher }));
     
    },
    async delete(ctx) {
        const [teacher] = await strapi.services.teacher.find({
        id: ctx.params.id,
        "principal.id": ctx.state.user.id,
        });
         
        if (!teacher) {
        return ctx.unauthorized(`You can't delete this entry`);
        }
         
        let entity = await strapi.services.teacher.delete({ id: ctx.params.id });
        return sanitizeEntity(entity, { model: strapi.models.teacher });
        },
    }