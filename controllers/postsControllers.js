const connection = require('../data/db')
/* const postsData = require('../data/postsData')
const posts = require('../data/postsData') */


function index(req, res) { 
  const sql = "SELECT * FROM posts";
  connection.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
}

function show(req, res) {
  const postId = Number(req.params.id);


  const sql = `
    SELECT 
      posts.*,
      GROUP_CONCAT(tags.label) as tags
    FROM posts 
    LEFT JOIN post_tag ON posts.id = post_tag.post_id
    LEFT JOIN tags ON post_tag.tag_id = tags.id
    WHERE posts.id = ?
    GROUP BY posts.id
  `;

  connection.query(sql, [postId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(404).json({
        error: '404 Not Found',
        message: 'Post not found'
      });
    }

    
    const post = result[0];
    post.tags = post.tags ? post.tags.split(',') : [];

    res.json(post);
  });
}


function create(req, res) {
  const title = req.body.title;
  const newSlug = title.toLowerCase().replace(/\s+/g, '-');

  const newPost = {
    title: title,
    slug: newSlug,
    content: req.body.content,
    image: req.body.image,
    tags: req.body.tags
  }

  postsData.push(newPost);

  console.log(postsData)

  res.status(201);
  res.json(newPost)

  /*  res.send('crea un post') */
}

function update(req, res) {
  const postSlug = req.params.slug
  const findPost = postsData.find(post => post.slug === postSlug)
  if (!findPost) {
    return res.status(404).json({
      error: '404 Not Found',
      message: 'Post not found'
    })
  }
  findPost.title = req.body.title;
  findPost.slug = req.body.slug;
  findPost.content = req.body.content;
  findPost.image = req.body.image;
  findPost.tags = req.body.tags;

  console.log(findPost)

  res.json(findPost)
  /* res.send(`Aggiorna il post con id: ${req.params.id}`) */
}


function modify(req, res) {
  const postSlug = req.params.slug
  const findPost = postsData.find(post => post.slug === postSlug)
  if (!findPost) {
    return res.status(404).json({
      error: '404 Not Found',
      message: 'Post not found'
    })
  }
  if (req.body.title) {
    findPost.title = req.body.title;
  }
  if (req.body.content) {
    findPost.slug = req.body.slug
  }
  if (req.body.content) {
    findPost.content = req.body.content
  }
  if (req.body.image) {
    findPost.content = req.body.image
  }
  if (req.body.tags) {
    findPost.tags = req.body.tags
  }


  console.log(findPost)

  res.json(findPost)
  /* res.send(`modificato il post con id: ${req.params.id}`) */
}

function destroy(req, res) {
  const postId = Number(req.params.id);
  const sql = 'DELETE FROM posts WHERE id = ?';
  connection.query(sql, [postId], (err) => {
    if (err) return res.status(500).json({ error: 'Query failed' })
    res.sendStatus(204);
  })
}


module.exports = {
  index,
  show,
  create,
  update,
  modify,
  destroy
};

