import { eq, inArray } from "drizzle-orm";
import express, { Request } from "ultimate-express";
import { LinkInsert, linkTable } from "../drizzle/schema/link.js";
import { db } from "./db.js";

const app = express()

interface DrizzleRequest<T> extends Request { body: T }

app.use(express.json())

app.get('/link', async (req, res) => {
  const links = await db.select().from(linkTable)
  return res.json({ data: links })
})

app.delete('/link', async (req, res) => {
  if (!req.query.ids) {
    return res.json({ err: 'Please provide ids' })
  }

  const ids = (req.query.ids as string).split(',')

  const [result] = await db
    .delete(linkTable)
    .where(inArray(
      linkTable.id,
      ids
        .filter(id => !Number.isNaN(id))
        .map(id => parseInt(id))
    ))

  const rows = result.affectedRows
  if (rows > 0) {
    return res.json({
      msg: `${rows} bookmark${rows > 1 ? 's' : ''} has been deleted`
    })
  } else {
    res.statusCode = 404
    return res.json({ msg: `No bookmark deleted` })
  }
})

app.post('/link', async (req: DrizzleRequest<LinkInsert>, res) => {
  const { title, url } = req.body

  if (!title) return res.json({ err: 'title is required' })
  if (!url) return res.json({ err: 'url is required' })
  if (title.length > 200) return res.json({ err: 'length must be or less than 200' })

  await db.insert(linkTable).values({ title, url })
  return res.json({ msg: 'bookmark added' })
})

app.put('/link/:id', async (req: DrizzleRequest<LinkInsert>, res) => {
  const { title, url } = req.body

  await db
    .update(linkTable)
    .set({ title, url })
    .where(eq(linkTable.id, parseInt(req.params.id)))

  return res.json({ msg: `Id ${req.params.id} updated` })
})

app.listen(3000, () => console.log('http://localhost:3000'))