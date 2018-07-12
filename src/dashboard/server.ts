import * as express from 'express';
import { join } from 'path';

let files = {};
let names = {};

let app = express();
app.set('view engine', 'ejs')

app.use('/popper.js', (req, res) => {
    res.sendFile(join(__dirname, '../../node_modules/popper.js/dist/umd/popper.min.js'));
});

app.use('/chart.js', (req, res) => {
    res.sendFile(join(__dirname, '../../node_modules/chart.js/dist/Chart.bundle.min.js'));
});

app.use('/jquery.min.js', (req, res) => {
    res.sendFile(join(__dirname, '../../node_modules/jquery/dist/jquery.min.js'));
});

app.use('/bootstrap', express.static(join(__dirname, '../../node_modules/bootstrap/dist')))

app.get('/', (req, res) => {
    res.render("index", { files, names });
});

app.listen(8080);

export function updateData(f, fileNames) {
    files = f;
    names = fileNames;
}