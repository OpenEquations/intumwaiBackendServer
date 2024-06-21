import mysql from 'mysql2'

import dotenv from 'dotenv'

dotenv.config();

const pool = mysql.createPool({
    host:process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT, 
    user: process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise();


export async function getBusses(){
    const [rows] = await pool.query("SELECT * FROM busses");
    return rows;
}
export async function createBuss(sits,
    company,
    from,
    to,
    departure_time,
    amount,
    date,
    plate_number,
    status){
    // const [result] = await pool.query("INSERT INTO busses(sits,company,from,to,departure_time,amount,date,plate_number,status) VALUES (?,?,?,?,?,?,?,?,?)",[sits,company,from,to,departure_time,amount,date,plate_number,status]);
    const [result] = await pool.query("INSERT INTO busses (`sits`, `company`, `from`, `to`, `departure_time`, `amount`, `date`, `plate_number`, `status`) VALUES (?,?,?,?,?,?,?,?,?)",[sits,company,from,to,departure_time,amount,date,plate_number,status]);
    return result.insertId;
}

export async function deleteBuss(rawId){
    const [rows] = await pool.query("DELETE FROM `intumwa`.`busses` WHERE (`buss_id` = ?)",[rawId]);
    return rows;
}

// // console.log(await getRawAndCorrectedTexts());

// export async function getNoneCorrectedRaw(teacherId){ // tested
//     const [rows] = await pool.query("SELECT * FROM raw_text WHERE teacher_id = ? AND teacher_text IS NULL;",[teacherId]);
//     return rows;
// }
// export async function getStudentTeacherConnections(studentId){ //tested
//     const [rows] = await pool.query("SELECT * FROM connections WHERE student_id = ? AND connection_status = 'active'",[studentId]);
//     return rows;
// }
// export async function createRawCorrection(teacherText,studentRate,rawTextId){ 
//     const [rows] = await pool.query("UPDATE raw_text SET teacher_text = ?, student_rate = ? WHERE raw_text_id = ? ",[teacherText,studentRate,rawTextId]);
//     return rows.changedRows;
// }

// console.log(await getBusses());
// console.log(await getStudentTeacherConnections(1));
// console.log(await getNoneCorrectedRaw(2));
// console.log(await createBuss(3,"cc","kk",1000,3000,1200,"2024-06-18","kk","kk"));
// console.log(await createRawCorrection("This is ass hoool",50,2));