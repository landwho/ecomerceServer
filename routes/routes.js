
const {Router} = require('express');
const router = Router();
const DB = require('../config/config');
const oracledb = require('oracledb');
const mulipart = require('connect-multiparty');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

router.get('/', (req, res)=>{
    res.status(200).json({
        status: 200,
        message: "este mensaje es desde el servidor"
    });
});



const multiPartMiddleware = mulipart({
    uploadDir:  __dirname +'/../images'
});




router.post('/api/subir',multiPartMiddleware,(req, res)=>{
    console.log(req)
    res.json({
        'message':'Fichero  subido',
       // file: __dirname +`/../images/`
    })
})

router.get('/api/image', function(req, res){
    console.log(req);console.log(res)
    res.json({
        file: __dirname +`/../images/`
    })
});

//==============OBTENER PAISES==================//

router.get('/api/getcountry',  function(req,res, next){

    oracledb.getConnection(db, async function(err, connection){
    
        try {
            query="select *from country";
            await connection.execute(query, function(err, data){
                if(err){
                    res.status(500).json({
                        status: 500,
                        message: 'error',
                        data: err.message
                    });
                }
                else{
                    res.status(200).json({
                        status: 200,
                        message: 'successful',
                        data: data.rows
                    });
                }
            });//end connection execute
        } catch (error) {
            next(err); 
        }

    });//end getConnection
}); //end of end point



//============== REGISTRO ==================//

//`insert into users(nombre_user,apellido_user,country_user,postal_user,email_user,cvc_card,fechaexp_card,number_card,limit_card,password)
//values('Jorge Ricardo','Ubico Brooks','Guatemala','502','admin@admin','322','2020-10-20','123456789',2000,'123');`


//insertNewPerson = `INSERT INTO users(nombre_user,apellido_user,country_user,postal_user,email_user,cvc_card,fechaexp_card,number_card,limit_card,password)
//VALUES(${nombre},${apellido},${country},${cvc},${email},${fechaexp},${limitecredito},${notarjeta},${password},${postal})`;

insertNewPerson = "INSERT INTO users(nombre_user,apellido_user,country_user,postal_user,email_user,cvc_card,fechaexp_card,number_card,limit_card,password)VALUES(:nombre,:apellido,:country,:postal,:email,:cvc,:fechaexp,:notarjeta,:limitecredito,:password)";

router.post('/api/register', function(req,res){
    const {nombre, apellido,country, postal,  email, cvc, fechaexp,notarjeta, limitecredito, password,  } = req.body; 
    const binds=[
        nombre,
        apellido,
        country,
        postal,
        email,
        cvc,
        fechaexp,
        notarjeta,
        limitecredito,
        password
        
    ];
    console.log(binds)
    //insertNewPerson = `INSERT INTO users(nombre_user,apellido_user,country_user,postal_user,email_user,cvc_card,fechaexp_card,number_card,limit_card,password)
//VALUES}(${apellido,${country},${cvc},${email},${fechaexp},${limitecredito},${nombre},${notarjeta},${password},${postal})`;

    oracledb.getConnection(db,function(err, connection){
        connection.execute(insertNewPerson,binds,{autoCommit: true}, function(err, data) {
              if(err){
                res.status(500).json({
                    status: 500,
                    message: 'error',
                    data: err.message
                });
            }
            else{
                res.status(200).json({
                    status: 200,
                    message: 'Usuario agregado exitosamente!!',
                    data: data.rows
                });
            } 
        });
    });//end getConnection    
}); //end of end point



//==============LOGIN==================//
login = "select nombre_user,apellido_user,country_user,postal_user,email_user,cvc_card,fechaexp_card,number_card,limit_card from users where email_user=:email and password= :pass";
router.post('/api/login', function(req,res){
    const {email, pass} = req.body; 
    const binds=[
        email,
        pass
    ];
    console.log(binds);

    oracledb.getConnection(db,function(err, connection){
        connection.execute(login,binds,{autoCommit: true}, function(err, data) {
              if(err){
                res.status(500).json({
                    status: 500,
                    message: 'error',
                    data: err.message
                });
            }
            else{
                res.status(200).json({
                    status: 200,
                    message: 'login!',
                    data: data.rows[0]
                });
            } 
        });
    });//end getConnection    
}); //end of end point






//=========================GET USER ==========================//

router.get('/api/user',  function(req,res, next){

    oracledb.getConnection(db, async function(err, connection){
    
        try {
            query="select *from users";
            await connection.execute(query, function(err, data){
                if(err){
                    res.status(500).json({
                        status: 500,
                        message: 'error',
                        data: err.message
                    });
                }
                else{
                    res.status(200).json({
                        status: 200,
                        message: 'successful',
                        data: data.rows
                    });
                }
            });//end connection execute
        } catch (error) {
            next(err); 
        }

    });//end getConnection
}); //end of end point







//==============INSERTAR CATEGORIAS==================//
insertNewCategory = "INSERT INTO categorias(id_categorias,nombre_categorias)VALUES(:id,:name)";
router.post('/api/postcategory', function(req,res){
    const {id, name } = req.body; 
    const binds=[
        id,
        name
    ];
    console.log(id)
    oracledb.getConnection(db,function(err, connection){
        connection.execute(insertNewCategory,binds,{autoCommit: true}, function(err, data) {
              if(err){
                res.status(500).json({
                    status: 500,
                    message: 'error',
                    data: err.message
                });
            }
            else{
                res.status(200).json({
                    status: 200,
                    message: 'Categoria agregada exitosamente!!',
                    data: data.rows
                });
            } 
        });
    });//end getConnection    
}); //end of end point


//==============INSERTAR SUB CATEGORIAS==================//
//'insert into SUBCATEGORIA (ID_SUBCATEGORIA,NAME_SUBCATEGORIA,CATID) values (SYS_GUID(),'Para hombres','R1')'


insertNewSubCategory = "INSERT INTO subcategoria(id_subcategoria,name_subcategoria,catID)VALUES(:id,:name, :idc)";
router.post('/api/postsubcategory', function(req,res){
    const {id, name, idc } = req.body; 
    const binds=[
        id,
        name,
        idc
    ];
    console.log(id)
    oracledb.getConnection(db,function(err, connection){
        connection.execute(insertNewSubCategory,binds,{autoCommit: true}, function(err, data) {
              if(err){
                res.status(500).json({
                    status: 500,
                    message: 'error',
                    data: err.message
                });
            }
            else{
                res.status(200).json({
                    status: 200,
                    message: 'SubCategoria agregada exitosamente!!',
                    data: data.rows
                });
            } 
        });
    });//end getConnection    
}); //end of end point





//==============OBTENER CATEGORIAS==================//

router.get('/api/getcategorias',  function(req,res, next){
    oracledb.getConnection(db, async function(err, connection){
        try {
            query="select *from categorias";
            await connection.execute(query, function(err, data){
                if(err){
                    res.status(500).json({
                        status: 500,
                        message: 'error',
                        data: err.message
                    });
                }
                else{
                    res.status(200).json({
                        status: 200,
                        message: 'successful',
                        data: data.rows
                    });
                }
            });//end connection execute
        } catch (error) {
            next(err); 
        }
    });//end getConnection
}); //end of end point



//==============OBTENER SUBCATEGORIAS==================//

//getSubCategoria =`select name_subcategoria , id_subcategoria from subcategoria where catID=${id}`

router.get('/api/subcategoria/:id', async function(req,res,next){
    let id = req.params.id
    console.log(id)
    oracledb.getConnection(db, async function(err, connection){
        try {
            getSubCategoria =`select name_subcategoria , id_subcategoria from subcategoria where catID='${id}'`;
            await connection.execute(getSubCategoria, (err, data)=>{
                 if(err){
                     res.status(500).json({
                         status: 500,
                         message: 'error',
                         data: err.message
                     });
                 }
                 else{
                     res.status(200).json({
                         status: 200,
                         message: 'successful',
                         data: data.rows
                     });
                 }
             });//end connection execute
        } catch (error) {
            next(err);
        }

    });//end getConnection
}); //end of end point

















//================ INSERTAR PRODUCTOS ==========================//

insertNewProduct = "INSERT INTO catalogo_productos(procutID,productName,productPrice,productdescription,productPhoto,cantidad,categoria,subcategoria)VALUES(:id,:name,:price,:description,:image,:cantidad,:categoria,:subcategoria)";
router.post('/api/postproduct', function(req,res){
    const {id, name, price, description, image, cantidad,categoria,subcategoria } = req.body; 
    const binds=[
        id,
        name,
        price,
        description,
        image,
        cantidad,
        categoria,
        subcategoria
    ];
  console.log(binds)
    oracledb.getConnection(db,function(err, connection){
        connection.execute(insertNewProduct,binds,{autoCommit: true}, function(err, data) {
              if(err){
                res.status(500).json({
                    status: 500,
                    message: 'error',
                    data: err.message
                });
            }
            else{
                res.status(200).json({
                    status: 200,
                    message: 'producto agregado exitosamente!!',
                    data: data.rows
                });
            } 
        });
    });//end getConnection    
}); //end of end point


//================ OBTENER PRODUCTOS ==========================//
router.get('/api/getproducts', function(req,res){
    
    oracledb.getConnection(db, function(err, connection){
        query="select *from catalogo_productos";
        connection.execute(query, function(err, data){
            if(err){
                res.status(500).json({
                    status: 500,
                    message: 'error',
                    data: err.message
                });
            }
            else{
                res.status(200).json({
                    status: 200,
                    message: 'successful',
                    data: data.rows
                });
            }
        });//end connection execute
    });//end getConnection
}); //end of end point




//================ BUSCAR PRODUCTOS EN LOS SELECTS ==========================//


router.post('/api/search', function(req,res){
    const {subcategoria } = req.body; 
    const binds=[
        subcategoria
    ];
    console.log(binds)
    oracledb.getConnection(db, async function(err, connection){
        try {
            search ="SELECT *FROM catalogo_productos WHERE subcategoria= :subcategoria";
            await connection.execute(search,binds, (err, data)=>{
                 if(err){
                     res.status(500).json({
                         status: 500,
                         message: 'error',
                         data: err.message
                     });
                 }
                 else{
                     res.status(200).json({
                         status: 200,
                         message: 'successful',
                         data: data.rows
                     });
                 }
             });//end connection execute
        } catch (error) {
            next(err);
        }

    });//end getConnection
}); //end of end point







//================ update saldo from payload ==========================//


//updateCreditFromPayload = "UPDATE users SET limit_card = limit_card - (:total) WHERE number_card=:tarjeta;";
router.post('/api/updatefrompayload', function(req,res){
    const {total, tarjeta} = req.body; 
    const binds=[
        total, 
        tarjeta
    ];
  console.log(binds)
    oracledb.getConnection(db,function(err, connection){
        updateCreditFromPayload = "UPDATE users SET limit_card = limit_card - (:total) WHERE number_card=:tarjeta";
        connection.execute(updateCreditFromPayload,binds,{autoCommit: true}, function(err, data) {
              if(err){
                res.status(500).json({
                    status: 500,
                    message: 'error',
                    data: err.message
                });
            }
            else{
                res.status(200).json({
                    status: 200,
                    message: 'Compra exitosa!!',
                    data: data.rows
                });
            } 
        });
    });//end getConnection    
}); //end of end point



//================ update saldo add more ==========================//
router.post('/api/updatesaldo', function(req,res){
    const {total, tarjeta} = req.body; 
    const binds=[
        total, 
        tarjeta
    ];
  console.log(binds)
    oracledb.getConnection(db,function(err, connection){
        updateCreditFromPayload = "UPDATE users SET limit_card = limit_card + :total WHERE number_card=:tarjeta";
        connection.execute(updateCreditFromPayload,binds,{autoCommit: true}, function(err, data) {
              if(err){
                res.status(500).json({
                    status: 500,
                    message: 'error',
                    data: err.message
                });
            }
            else{
                res.status(200).json({
                    status: 200,
                    message: 'Saldo Agregado',
                    data: data.rows
                });
            } 
        });
    });//end getConnection    
}); //end of end point






//================ BackGrounds ==========================//


router.get('/api/bg', function(req,res){
    
    oracledb.getConnection(db, function(err, connection){
        query="select *from bgs";
        connection.execute(query, function(err, data){
            if(err){
                res.status(500).json({
                    status: 500,
                    message: 'error',
                    data: err.message
                });
            }
            else{
                res.status(200).json({
                    status: 200,
                    message: 'successful',
                    data: data.rows
                });
            }
        });//end connection execute
    });//end getConnection
}); //end of end point


//================ GET USERS ==========================//

router.get('/api/users', function(req,res){
    
    oracledb.getConnection(db, function(err, connection){
        query="select *from users";
        connection.execute(query, function(err, data){
            if(err){
                res.status(500).json({
                    status: 500,
                    message: 'error',
                    data: err.message
                });
            }
            else{
                res.status(200).json({
                    status: 200,
                    message: 'successful',
                    data: data.rows
                });
            }
        });//end connection execute
    });//end getConnection
}); //end of end point








//================ INSERT TRANSAC ==========================//

router.post('/api/postransac', function(req,res){

json = JSON.stringify(req.body);
console.log(json); 
    
    oracledb.getConnection(db, function(err, connection){
       
        updateCreditFromPayload = " INSERT INTO json_payload (data) VALUES (:json)";
        connection.execute(updateCreditFromPayload, {json: json } , { autoCommit: true}, function(err, rows, fields){
            console.log(rows)
            if(err){
                res.status(500).json({
                    status: 500,
                    message: 'error',
                    data: err.message
                });
            }
            else{

                res.status(200).json({
                    status: 200,
                    message: 'successful',
                    data: req.body
                });
           
            } 


        });//end connection execute
    });//end getConnection    
}); //end of end point









//================ GET TRANSACTIONS ==========================//

router.post('/api/getransac', function(req,res){
    let id = req.body.id;
    let monto = req.body.monto;
    console.log(req.body.id);
    console.log(req.body.monto);

    oracledb.getConnection(db, function(err, connection){
        query =`select d.data.nombre,d.data.fecha, d.data.tarjeta, d.data.total, d.data.product from json_payload d 
        where  d.data.tarjeta = ${id} and d.data.total=${monto}`;
       connection.execute(query, function(err, data, fields){
        console.log(data.rows)
            
          
           if(err){
                res.status(500).json({
                    status: 500,
                    message: 'error',
                    data: err.message
                });
            }
            else{
                res.status(200).json({
                    status: 200,
                    message: 'successful',
                    data: data.rows
                });
            }

        });//end connection execute
    });//end getConnection 
}); //end of end point



//================ GET TRANSACTIONS DETAIL ==========================//


router.get('/api/getpaysbytarget/:id', function(req,res){
    let id = req.params.id
    console.log(id)
    oracledb.getConnection(db, function(err, connection){

        query=`select d.data.id, d.data.nombre,d.data.fecha, d.data.tarjeta, d.data.total from   json_payload d where  d.data.tarjeta = ${id}`;  
        connection.execute(query, function(err, data, fields){


            if(err){
                res.status(500).json({
                    status: 500,
                    message: 'error',
                    data: err.message
                });
            }
            else{
                res.status(200).json({
                    status: 200,
                    message: 'successful',
                    data: data.rows
                });
            }


        });//end connection execute 
    });//end getConnection 
}); //end of end point



//================ DELETE A TRANSACTION ==========================//

router.delete('/api/delete/:id',(req, res)=>{
    let id = req.params.id;  
    console.log( id)
    oracledb.getConnection(db, function(err, connection){
        query=`delete from json_payload d where d.data.id=:id`;  
        connection.execute(query,{id:id}, { autoCommit: true},function(err, data, fields){
            if(!err){ 
                res.json("Registro eliminado");
                res.status(200)
            }else{
                res.json({Status:'Delete status: ERROR!'})
                console.log(err);
            }
        });//end connection execute 
    });//end getConnection 
});




















//================ANONIMOUS USER CAN BUY=====================

//================ INSERT TRANSAC ==========================//

router.post('/api/posanonimousbuy', function(req,res){

    json = JSON.stringify(req.body);
    console.log(json); 
        
        oracledb.getConnection(db, function(err, connection){
           
            updateCreditFromPayload = " INSERT INTO json_anonimous_payload (data) VALUES (:json)";
            connection.execute(updateCreditFromPayload, {json: json } , { autoCommit: true}, function(err, rows, fields){
                console.log(rows)
                if(err){
                    res.status(500).json({
                        status: 500,
                        message: 'error',
                        data: err.message
                    });
                }
                else{
    
                    res.status(200).json({
                        status: 200,
                        message: 'successful',
                        data: req.body
                    });
               
                } 
    
    
            });//end connection execute
        });//end getConnection    
    }); //end of end point
    
























module.exports = router;



