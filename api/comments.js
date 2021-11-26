import _ from 'underscore'
import { TABLE_NAMES } from '../consts'
import EntityMarez from 'entity-api-base'

const conf = {
  tablename: TABLE_NAMES.COMMENTS,
  editables: ['content']
}

export default (knex, ErrorClass) => {
  const MW = EntityMarez(conf, knex, ErrorClass)
  return {
    create: (req, res, next) => {
      // TODO: check if I can and the task is our org
      Object.assign(req.body, { author: req.user.id, taskid: req.params.id })
      MW.create(req.body, req.schema)
        .then(saved => res.status(201).json(saved))
        .catch(next)
    },
    list: (req, res, next) => {
      req.query.filter = req.query.filter ? JSON.parse(req.query.filter) : {}
      Object.assign(req.query.filter, { taskid: req.params.id })
      MW.list(req.query, req.schema)
        .then(data => res.json(data))
        .catch(next)
    }
  }
}