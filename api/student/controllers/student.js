// 'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

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
      if(ctx.state.user.id<3){
        const { data, files } = parseMultipartData(ctx);
        data.principal = ctx.state.user.id;
        entity = await strapi.services.student.create(data, { files });
      }
      else{
        const { data, files } = parseMultipartData(ctx);
      var temp = ctx.state.user.id + 2;
      data.teacher = temp;
      entity = await strapi.services.student.create(data, { files });
      } 
    } else {
      if(ctx.request.body.id < 3){
        ctx.request.body.principal = ctx.state.user.id;
        entity = await strapi.services.student.create(ctx.request.body);
      }
      else{
        ctx.request.body.teacher = temp;
        entity = await strapi.services.student.create(ctx.request.body);
      }
    }
    return sanitizeEntity(entity, { model: strapi.models.student });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    const { id } = ctx.params;

    let entity;

    const [student] = await strapi.services.student.find({
      id: ctx.params.id,
      'principal.id': ctx.state.user.id,
    });

    if (!student) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.student.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.student.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.student });
  },
    async delete(ctx) {
        const [student] = await strapi.services.student.find({
        id: ctx.params.id,
        "principal.id": ctx.state.user.id,
        });
         
        if (!student) {
        return ctx.unauthorized(`You can't delete this entry`);
        }
         
        let entity = await strapi.services.student.delete({ id: ctx.params.id });
        return sanitizeEntity(entity, { model: strapi.models.student });
        },
        async find(ctx) {
          let entities;
           
          if (ctx.query._q) {
            if(ctx.state.user.id < 3){
              entities = await strapi.services.student.search({
                ...ctx.query,
                  'principal.id': ctx.state.user.id,
                });
            }
            else{
              entities = await strapi.services.student.search({
                ...ctx.query,
                  'teacher.id': ctx.state.user.id,
                });
            }
          } else {
            if(ctx.state.user.id < 3){
              entities = await strapi.services.student.find({
                ...ctx.query,
                'principal.id': ctx.state.user.id,
                });
            }
            else{
              entities = await strapi.services.student.find({
                ...ctx.query,
                'teacher.id': ctx.state.user.id

                });
            }
          }

          // if (ctx.query._q) {
          //   entities = await strapi.services.student.search({
          //   ...ctx.query,
          //   'teacher.id': ctx.state.user.id
          //   });
          //   } else {
          //   entities = await strapi.services.student.find({
          //   ...ctx.query,
          //   'teacher.id': ctx.state.user.id
          //   });
          //   }
           
          return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.student }));
           
          },
    // async find(ctx) {
    // let entities;
     
    // if (ctx.query._q) {
    // entities = await strapi.services.student.search({
    // ...ctx.query,
    // 'teacher.TeacherId': ctx.state.user.id
    // });
    // } else {
    // entities = await strapi.services.student.find({
    // ...ctx.query,
    // 'teacher.TeacherId': ctx.state.user.id
    // });
    // }
     
    // return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.student }));
     
    // },
  //   async create(ctx) {
  //   let entity;
  //   if (ctx.is('multipart')) {
  //     const { data, files } = parseMultipartData(ctx);
  //     var temp = ctx.state.user.id + 2;
  //     data.teacher = temp;
  //     entity = await strapi.services.student.create(data, { files });
  //   } else {
  //     ctx.request.body.teacher = temp;
  //     entity = await strapi.services.student.create(ctx.request.body);
  //   }
  //   return sanitizeEntity(entity, { model: strapi.models.student });
  // }
};