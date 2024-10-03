const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

// เชื่อมต่อฐานข้อมูล MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_db'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});

// ตั้งค่า EJS เป็น View Engine
app.set('view engine', 'ejs');

// ใช้ body-parser สำหรับ parse ฟอร์ม
app.use(bodyParser.urlencoded({ extended: false }));

// ROUTES

// แสดงข้อมูล (Read)
app.get('/', (req, res) => {
    const query = 'SELECT * FROM users';
    connection.query(query, (err, results) => {
        if (err) throw err;
        res.render('index', { users: results });
    });
});

// แสดงฟอร์มเพิ่มข้อมูล (Create)
app.get('/add', (req, res) => {
    res.render('add');
});

// เพิ่มข้อมูลในฐานข้อมูล
app.post('/add', (req, res) => {
    const { name, email } = req.body;
    const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
    connection.query(query, [name, email], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// แสดงฟอร์มแก้ไขข้อมูล (Update)
app.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM users WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) throw err;
        res.render('edit', { user: results[0] });
    });
});

// แก้ไขข้อมูลในฐานข้อมูล
app.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    connection.query(query, [name, email, id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// ลบข้อมูล (Delete)
app.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// เปิดเซิร์ฟเวอร์
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
