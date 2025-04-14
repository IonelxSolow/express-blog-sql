const connection = require('../data/db')
/* const postsData = require('../data/postsData')
const posts = require('../data/postsData') */


function index(req, res) { 
  const sql = "SELECT * FROM posts";
  connection.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database query failed' });
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
    if (err) return res.status(500).json({ error: 'Database query failed' });

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
  const { title, content, image } = req.body;

  const sql = `
    INSERT INTO posts (title, content, image) 
    VALUES (?, ?, ?)
  `;

  connection.query(sql, [title, content, image], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    // recupera il post appena creato
    const postId = result.insertId;
    const selectSql = "SELECT * FROM posts WHERE id = ?";

    connection.query(selectSql, [postId], (err, [post]) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(post);
    });
  });
}

function update(req, res) {
  const postId = req.params.id;
  const { title, content, image } = req.body;

  const sql = `
    UPDATE posts 
    SET title = ?, content = ?, image = ?
    WHERE id = ?
  `;

  connection.query(sql, [title, content, image, postId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: '404 Not Found',
        message: 'Post not found'
      });
    }

    // recupera il post aggiornato
    const selectSql = "SELECT * FROM posts WHERE id = ?";
    connection.query(selectSql, [postId], (err, [post]) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(post);
    });
  });
}


function modify(req, res) {
  const postId = req.params.id;
  const updates = {};
  const values = [];

  // costruisce dinamicamente la query in base ai campi forniti
  if (req.body.title) {
    updates.title = '?';
    values.push(req.body.title);
  }
  if (req.body.content) {
    updates.content = '?';
    values.push(req.body.content);
  }
  if (req.body.image) {
    updates.image = '?';
    values.push(req.body.image);
  }

  // se non ci sono campi da aggiornare
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  // costruisce la query SQL
  const setClauses = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const sql = `UPDATE posts SET ${setClauses} WHERE id = ?`;
  values.push(postId);

  connection.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: 'Query failed' });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: '404 Not Found',
        message: 'Post not found'
      });
    }

    // recupera il post modificato
    const selectSql = "SELECT * FROM posts WHERE id = ?";
    connection.query(selectSql, [postId], (err, [post]) => {
      if (err) return res.status(500).json({ error: 'Query failed' });
      res.json(post);
    });
  });
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

