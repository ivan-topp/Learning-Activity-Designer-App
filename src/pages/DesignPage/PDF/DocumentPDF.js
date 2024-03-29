import React, { useEffect, useRef } from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';
import Logo from 'assets/img/logo_uct.png';
import { useBetween } from 'use-between';
import { MiniContext } from './MiniContext';
import { formatDate } from 'utils/dateTimeFormatter';

export const DocumentPDF = ({design, img, typeUserPDF}) => {
    const { selectedDate, privileges} = useBetween(MiniContext);
    const styles = StyleSheet.create({
        logo: {
            width: 250,
            objectFit: 'cover',
            marginVertical: 15,
            marginHorizontal: 'auto',
        }, 
        title: {
            fontSize: 20,
            textAlign: 'center',
            marginBottom: 25,
        }, 
        box: { 
            width: '100%',
        }, 
        pageNumber: {
            position: 'absolute',
            fontSize: 12,
            bottom: 30,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'grey',
        },
        date:{ 
            position: 'absolute',
            fontSize: 12,
            bottom: 50,
            textAlign: 'center',
        },  
        marginTitle:{
            fontSize: 15,
            marginLeft: 35,
            marginTop: 15,
        }, 
        secondTitle:{
            fontSize: 17,
            textAlign: 'center',
            marginBottom: 15,
            marginLeft: 16,
            marginRight: 16
        },
        body:{
            paddingTop: 35,
            paddingBottom: 65,
        }, 
        table: {
            display: "table",
            flexDirection: "column",
            marginLeft: 15,
            marginBottom: 10,
            marginRight: 15,
            justifyContent: "flex-start",
            alignContent: "stretch",
            flexWrap: "nowrap",
            alignItems: "stretch",
          },
        row: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            fontSize: 12,
        }, 
        cell: {
            flexGrow: 1,
            flexShrink: 1,
            marginLeft: 16,
            marginRight: 16,
            marginBottom: 3,
            flexBasis: "auto",
            alignSelf: "stretch"
        },
        breakLine:{
            width: '100%', 
            height: 400,
        }
    });
    const isMounted = useRef(true);
    let manyAuthorsSelected = 0;

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    privileges.forEach( author => {
        if(author.selected) 
            manyAuthorsSelected = manyAuthorsSelected + 1
        }
    )
    return (
        <>
            <Document >
                <Page size="A4" wrap style={styles.body}>
                    <View style={styles.box} >
                        <Image
                            src={Logo}
                            style = {styles.logo}
                        />
                        {(design.metadata.name === '') 
                            ? <Text style={styles.title}> Nombre no definido. </Text>
                            : <Text style={styles.title}> {design.metadata.name}. </Text>
                        }
                        <View style={{textAlign: 'center', marginBottom: 15}}>
                            {
                                (privileges.map((author)=> author.selected).reduce((a, b)=> a || b) && 
                                    (manyAuthorsSelected === 1) 
                                    ? <Text style={{fontSize: 12, color: '#979797'}}>Autor</Text>
                                    : (manyAuthorsSelected > 1) 
                                    && <Text style={{fontSize: 12, color: '#979797'}}>Autores</Text>
                                ) 
                            }
                            {privileges.map((author, i) =>
                                {   
                                    if (!author.selected) {
                                        return <div key= {`author-${i}`}></div>
                                    }
                                    return (
                                    <div key= {`author-${i}`}>   
                                        <Text style={{fontSize: 12, marginLeft: 10}}>{author.user.name + ' ' + author.user.lastname}</Text>
                                    </div> 
                                )}
                            )}
                        </View>
                        {(typeUserPDF === 'teacher') ?
                        <> 
                        <View style={styles.table}>
                            <View style={[styles.row]}>
                                <Text style={[styles.cell, {color: '#979797'}]}>Nombre</Text>
                                <Text style={[styles.cell, {color: '#979797'}]}>Área disciplinar</Text>
                            </View>
                            <View style={[styles.row]}>
                                {(design.metadata.name === '') 
                                    ? <Text style={styles.cell}>No especificado</Text>
                                    : <Text style={styles.cell}>{design.metadata.name}.</Text>
                                }
                                <Text style={styles.cell}>{design.metadata.category.name}.</Text>
                            </View>

                            <View style={[styles.row]}>
                                <Text style={[styles.cell, {color: '#979797'}]}>Tiempo de trabajo</Text>
                                <Text style={[styles.cell, {color: '#979797'}]}>Tamaño de la clase</Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={styles.cell}>{design.metadata.workingTime.hours} hrs : {design.metadata.workingTime.minutes} min.</Text>
                                <Text style={styles.cell}>{design.metadata.classSize}.</Text>
                            </View>
                        
                            <View style={[styles.row]}>
                                <Text style={[styles.cell, {color: '#979797'}]}>Conocimiento Previo</Text>
                                {/*<Text style={[styles.cell, {color: '#979797'}]}>Objetivos</Text>*/}
                            </View>
                            <View style={[styles.row]}>
                                {(design.metadata.priorKnowledge === '') 
                                    ? <Text style={styles.cell}>No especificado.</Text>
                                    : <Text style={styles.cell}>{design.metadata.priorKnowledge}.</Text>
                                }
                                {/*(design.metadata.objective === '') 
                                    ? <Text style={styles.cell}>No especificado.</Text>
                                    : <Text style={styles.cell}>{design.metadata.objective}.</Text>
                                */}
                            </View>
                            <View style = {{marginLeft: 16, marginRight: 16}}>
                                <Text style={{fontSize: 12, color: '#979797', marginTop: 5, marginBottom: 5}} >Descripción</Text>
                                {
                                    (design.metadata.description === '') 
                                    ? <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>No definido.</Text>
                                    : <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>{design.metadata.description}</Text>
                                } 
                            </View>
                            <View style = {{marginLeft: 16, marginRight: 16}}>
                                <Text style={{fontSize: 12, color: '#979797', marginTop: 5, marginBottom: 5}} >Pauta de evaluación</Text>
                                {
                                    (design.metadata.evaluationPattern === '') 
                                    ? <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>No definido.</Text>
                                    : <Text wrap style={{fontSize: 12, justifyContent: 'center', color:'#5564eb'}} >{design.metadata.evaluationPattern}</Text>
                                } 
                            </View>
                            <View style = {{marginLeft: 16, marginRight: 16}}>
                                <Text style={{fontSize: 12, color: '#979797', marginTop: 5, marginBottom: 5}} >Evaluación</Text>
                                {
                                    (design.metadata.evaluation === '') 
                                    ? <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>No definido.</Text>
                                    : <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>{design.metadata.evaluation}</Text>
                                } 
                            </View>
                        </View>
                        </>
                        :
                        //Estudiante
                        <View style={{marginLeft: 45, marginBottom: 10, marginRight: 45}}>
                            <Text style={{color: '#2F5396', marginBottom: 5}}>¿Qué aprenderás en este modulo?</Text>
                            {
                                (design.metadata.description === '') 
                                ? <Text wrap style={{fontSize: 12, justifyContent: 'center', marginBottom: 15}}>No definido.</Text>
                                : <Text wrap style={{fontSize: 12, justifyContent: 'center', marginBottom: 15}}>{design.metadata.description}</Text>
                            }
                            <Text style={{color: '#2F5396', marginBottom: 5}}>¿Qué necesitas conocer previamente?</Text>
                            {
                                (design.metadata.priorKnowledge === '') 
                                ? <Text wrap style={{fontSize: 12, justifyContent: 'center', marginBottom: 15}}>No especificado.</Text>
                                : <Text wrap style={{fontSize: 12, justifyContent: 'center', marginBottom: 15}}>{design.metadata.priorKnowledge}.</Text>
                            }
                            <Text style={{color: '#2F5396', marginBottom: 5}}>¿Cómo serás evaluado?</Text>
                            {
                                (design.metadata.evaluation === '') 
                                ? <Text wrap style={{fontSize: 12, justifyContent: 'center', marginBottom: 15}}>No definido.</Text>
                                : <Text wrap style={{fontSize: 12, justifyContent: 'center', marginBottom: 15}}>{design.metadata.evaluation}</Text>
                            }
                            <Text style={{color: '#2F5396', marginBottom: 5}}>La pauta de evaluación la encuentras en:</Text>
                            {
                                (design.metadata.evaluationPattern === '') 
                                ? <Text wrap style={{fontSize: 12, justifyContent: 'center', marginBottom: 15}}>No definido.</Text>
                                : <Text wrap style={{fontSize: 12, justifyContent: 'center', color:'#5564eb', marginBottom: 15}} >{design.metadata.evaluationPattern}</Text>
                            } 

                        </View>
                        }
                        
                        <View style = {(typeUserPDF === 'teacher') ? [styles.table, {marginLeft: 16, marginRight: 16, height: 650}] : {marginLeft: 45, marginBottom: 10, marginRight: 45, height: 650}} wrap={false}>
                            {(typeUserPDF === 'teacher') 
                            ? <Text style ={[styles.secondTitle, {borderBottom: 1, borderColor: '#979797'}]}> Aprendizajes esperados.</Text>
                            : <Text style={{color: '#2F5396', marginTop: 5, marginBottom: 5}}>¿Qué aprendizajes específicos se esperan?</Text>
                            }
                            { design.metadata.results.length === 0 
                                ? <Text style={{fontSize: 12, marginBottom: 5, marginLeft: 16}} >No han sido proporcionados.</Text>
                                : design.metadata.results.map((result, i) =>
                                    <View key = {`learning-result-${i}`}>
                                        {(typeUserPDF === 'teacher') 
                                            ? <>
                                                <Text style={{fontSize: 12, color: '#979797', marginTop: 2, marginBottom: 2, marginLeft: 16}} >Aprendizaje esperado número {i + 1}:</Text>
                                                <Text style={{fontSize: 12, marginBottom: 2, marginLeft: 16}} >{result.verb + ' ' + result.description}</Text>
                                              </>
                                            : <Text style={{fontSize: 12, marginTop: 2, marginBottom: 2, marginLeft: 16}} >{i + 1}.- {result.verb + ' ' + result.description}</Text>
                                        }
                                            
                                    </View>
                                )
                            }
                        </View>
                        <View style={[styles.table]} wrap={false}>
                            <Text style ={[styles.secondTitle, {borderBottom: 1, borderColor: '#979797'}]}> Actividades</Text>
                            { design.data.learningActivities && design.data.learningActivities.map((learningActivity, index) =>
                                <View key = {`learning-activity-${index}`} style = {{marginBottom: 20}} wrap = {(index >= 1) ? false : true}>
                                    <View style = {{ marginBottom: 5 }}>
                                        <Text style={{fontSize: 14, marginLeft: 16}}>Actividad {index + 1}: {(learningActivity.title === '') 
                                        ? <Text style={{fontSize: 13, marginLeft: 16}}> No definido. </Text>
                                        : <Text style={{fontSize: 13, marginLeft: 16}}> {learningActivity.title} </Text>
                                        }</Text>
                                        
                                    </View>
                                    <View style = {{marginLeft: 16, marginRight: 20, marginBottom: 10}}>
                                        {  /* 
                                            (learningActivity.evaluation.length <= 1 ) 
                                            ? <Text style={{fontSize: 14, color: '#979797', marginTop: 5}} >Evaluación ha realizar en esta actividad.</Text>
                                            : <Text style={{fontSize: 14, color: '#979797', marginTop: 5}} >Evaluaciones ha realizar en esta actividad.</Text>
                                        */}
                                        { (learningActivity.evaluation.length === 0 )
                                            ? <Text style={{fontSize: 13}}> No se ha especificado.</Text>
                                            : learningActivity.evaluation.map((evaluation, i) => 
                                                <View key = {`evaluation-${i}`}>
                                                    <Text style={{fontSize: 12, color: '#979797', marginTop: 10, marginBottom: 5}} >Evaluación {i + 1}: {(evaluation.type === 'Seleccionar')
                                                    ? <Text style={{fontSize: 12, justifyContent: 'center'}}>No definido.</Text>
                                                    : <Text style={{fontSize: 12, justifyContent: 'center'}}>{evaluation.type}</Text>}</Text>
                                                    {(evaluation.description === '') ?
                                                    <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>No definido.</Text>
                                                    :
                                                    <Text wrap style={{fontSize: 12, justifyContent: 'flex-end'}}>{evaluation.description}</Text>}
                                                </View> 
                                            )
                                        }
                                    </View>
                                    {(typeUserPDF === 'student') &&
                                        <View style={{marginBottom: 5}}>
                                            <Text style ={{marginLeft: 16, fontSize: 12, color: '#6AA3D8'}}> Para desarrollar la Actividad {index + 1} deberás cumplir las siguientes tareas:</Text>
                                        </View>
                                    }
                                    { learningActivity.tasks && learningActivity.tasks.map((task, indexTask) =>
                                        <View key = {`task-${indexTask}`} style={(typeUserPDF === 'student') && {  marginLeft: 16, marginRight: 16}}>
                                            {(typeUserPDF === 'student') &&
                                                <Text style ={{marginLeft: 16, fontSize: 12, marginTop: 10, marginBottom: 5 }}> Tarea número {indexTask + 1}.</Text>
                                            }
                                            <View style={(typeUserPDF === 'teacher') ? [styles.table,{
                                                    borderColor: 
                                                        task.learningType === 'Investigación' 
                                                        ? '#57A8E7' 
                                                        : task.learningType === 'Adquisición'
                                                        ? '#E95D5D' 
                                                        : task.learningType === 'Producción'
                                                        ? '#C8951F'
                                                        : task.learningType === 'Discusión'
                                                        ? '#087A4C'
                                                        : task.learningType === 'Colaboración'
                                                        ? '#DFDF3F'
                                                        : task.learningType === 'Práctica'
                                                        ? '#A75BCD'
                                                        : task.learningType === 'Seleccionar'
                                                        && '#979797',
                                                    borderLeftWidth: 40}]
                                                    : { marginBottom : 10, marginLeft: 15, marginRight: 15}    
                                                }>
                                                <View style={[styles.row, {marginTop: 5}]}>
                                                    {
                                                        (typeUserPDF === 'teacher') &&
                                                        <Text style={[styles.cell, {color: '#979797'}]}>Aprendizaje</Text>
                                                    }
                                                    <Text style={[styles.cell, {color: '#979797'}]}>Tiempo</Text>
                                                    <Text style={[styles.cell, {color: '#979797'}]}>Modalidad</Text>
                                                </View>
                                                <View style={[styles.row]}>
                                                    {
                                                        (typeUserPDF === 'teacher') &&
                                                        <>
                                                            {(task.learningType === 'Seleccionar')
                                                                ? <Text style={[styles.cell]}>No especificado.</Text>
                                                                : <Text style={[styles.cell]}>{task.learningType}</Text>
                                                            }
                                                        </>   
                                                    }
                                                    <Text style={[styles.cell]}>{task.duration.hours} hrs : {task.duration.minutes} min.</Text>
                                                    {(task.modality === 'Seleccionar' || task.modality.trim().length === 0) 
                                                        ? <Text style={[styles.cell]}> No especificado. </Text> 
                                                        : <Text style={[styles.cell]}> {task.modality} </Text>
                                                    }
                                                </View>
                                                <View style={[styles.row]}>
                                                    <Text style={[styles.cell, {color: '#979797'}]}>Formato</Text>
                                                    {  (task.format === 'Grupal') 
                                                        && <>
                                                            <Text style={[styles.cell, {color: '#979797'}]}>Número de integrantes</Text>
                                                            { typeUserPDF === 'teacher' &&
                                                                <Text style={[styles.cell, {color: '#979797'}]}></Text>
                                                            }
                                                        </>
                                                    }
                                                </View>
                                                <View style={[styles.row]}>
                                                    {(task.format === 'Seleccionar' || task.format.trim().length === 0) 
                                                        ? <Text style={[styles.cell]}>No especificado.</Text>
                                                        : <Text style={[styles.cell]}>{task.format}</Text>
                                                    }
                                                    {  (task.format === 'Grupal') 
                                                        && <>
                                                            <Text style={styles.cell}> {task.groupSize}</Text> 
                                                            { typeUserPDF === 'teacher' &&
                                                                <Text style={[styles.cell, {color: '#979797'}]}></Text>
                                                            }
                                                        </> 
                                                    }
                                                </View>
                                                <View style={{marginLeft: 16, marginRight: 16}}>
                                                    <Text style={{fontSize: 12, color: '#979797', marginTop: 10, marginBottom: 5}} >Descripción</Text>
                                                    {(task.description === '') 
                                                        ? <Text wrap style={{fontSize: 12, justifyContent: 'center'}}> No especificado. </Text> 
                                                        : <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>{task.description}</Text>
                                                    }
                                                    <View style={{marginBottom: 5}}>
                                                        <Text style={{fontSize: 12, color: '#979797', marginTop: 15, marginBottom: 5}} >Enlace de recursos</Text>
                                                        { (task.resourceLinks.length === 0) 
                                                            ? <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>No se han proporcionado recursos</Text>
                                                            : (task.resourceLinks.map((resource, i) =>
                                                                <div key = {`resource-${i}-task-${indexTask}-learningnActivity${index}`}>
                                                                    <View style={{marginBottom: 5}}>
                                                                        {(resource.title === '') 
                                                                            ? <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>Título no definido, {(resource.link === '') 
                                                                                ? <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>No definido.</Text>
                                                                                : <Link wrap style={{fontSize: 12, justifyContent: 'center', color:'#5564eb'}}>{resource.link}</Link>
                                                                            }</Text>
                                                                            : <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>{resource.title}, {(resource.link === '') 
                                                                                ? <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>No definido.</Text>
                                                                                : <Link wrap style={{fontSize: 12, justifyContent: 'center', color:'#5564eb'}}>{resource.link}</Link>
                                                                            }</Text>
                                                                        }
                                                                    </View>
                                                                </div> 
                                                            ))
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                        <View style = {{marginTop: 15}} wrap={false}>
                            {(typeUserPDF === 'teacher' ) &&
                                <Image
                                    src={img}
                                />
                            }
                        </View>
                    </View>
                    <Text style={styles.date} render={({ pageNumber }) => (
                        (pageNumber === 1) && formatDate(new Date(selectedDate), true)
                    )} fixed />
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `${pageNumber} / ${totalPages}`
                    )} fixed />
                </Page>
            </Document>
        </>
    )
}