app.get('/forms', (req, res) => {
    db.query('SELECT * FROM forms', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});