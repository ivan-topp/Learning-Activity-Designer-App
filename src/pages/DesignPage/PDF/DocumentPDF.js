import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Link } from '@react-pdf/renderer';
import Logo from 'assets/img/Logo.png';

export const DocumentPDF = ({design, img, typeUserPDF}) => {
    const styles = StyleSheet.create({
        logo: {
            width: 100,
            height: 100,
            marginVertical: 15,
            marginHorizontal: 250
        }, title: {
            fontSize: 20,
            textAlign: 'center',
            marginBottom: 25,
        }, box: { 
            width: '100%',
        }, pageNumber: {
            position: 'absolute',
            fontSize: 12,
            bottom: 30,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'grey',
        }, table: { 
            display: "table", 
            width: "auto",
            marginLeft: 50,
            marginBottom: 10,
            marginRight: 50, 
        }, tableRow: { 
            margin: "auto", 
            flexDirection: "row",
        }, tableCol: { 
            width: "100%",  
        }, tableCell: { 
            margin: "auto", 
            marginTop: 5, 
            fontSize: 12 
        }, marginTitle:{
            fontSize: 15,
            marginLeft: 50,
            marginTop: 15,
            marginBottom: 10
        }, body:{
            paddingTop: 35,
            paddingBottom: 65,
        }
    });
    
    return (
        <>
            <Document >
                <Page size="A4" wrap style={styles.body}>
                    <View style={styles.box} >
                        <Image
                            src={Logo}
                            style = {styles.logo}
                        />
                        {(design.metadata.name === '') ?
                            <Text style={styles.title}> Nombre no definido. </Text>
                            : 
                            <Text style={styles.title}> {design.metadata.name}. </Text>
                        }
                        <View style={styles.table}>
                            {(typeUserPDF === 'teacher') && 
                                <View style={styles.tableRow}>
                                    <View style={styles.tableCol}>
                                        <Text style={[styles.tableCell,  {color: '#979797'}]}>Nombre</Text>
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={[styles.tableCell,  {color: '#979797', marginLeft: 6}]}>Área disciplinar</Text>
                                    </View>
                                </View>
                            }
                            {(typeUserPDF === 'teacher') && 
                                <View style={styles.tableRow}>
                                    <View style={styles.tableCol}>
                                        {(design.metadata.name === '') ?
                                            <Text style={[styles.tableCell, { marginBottom: 10}]}> No especificado. </Text>
                                            : 
                                            <Text style={[styles.tableCell, { marginBottom: 10}]}> {design.metadata.name}. </Text>
                                        }
                                    </View>
                                    <View style={styles.tableCol}>
                                        <Text style={[styles.tableCell, {marginBottom: 10, marginLeft: 6}]}>{design.metadata.category.name}</Text>
                                    </View>
                                </View>
                            }
                            <View style={styles.tableRow}>
                                <View style={styles.tableCol}>
                                    <Text style={[styles.tableCell,  {color: '#979797'}]}>Tiempo de trabajo</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={[styles.tableCell,  {color: '#979797', marginLeft: 6}]}>Modo de Entrega</Text>
                                </View>
                            </View>
                            <View style={styles.tableRow}> 
                                <View style={styles.tableCol}> 
                                    <Text style={[styles.tableCell, {marginBottom: 10}]}> {design.metadata.workingTime.hours} hrs : {design.metadata.workingTime.minutes} min</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    {(design.metadata.name === '') ?
                                        <Text style={[styles.tableCell, {marginLeft: 6}]}> No especificado. </Text>
                                        : 
                                        <Text style={[styles.tableCell, {marginLeft: 6}]}> {design.metadata.name}. </Text>
                                    }
                                </View>
                            </View>
                            {(typeUserPDF === 'teacher') && 
                                <>
                                    <View style={styles.tableRow}>
                                        <View style={styles.tableCol}>
                                            <Text style={[styles.tableCell,  {color: '#979797'}]}>Tamaño de la clase</Text>
                                        </View>
                                        <View style={styles.tableCol}>
                                            <Text style={[styles.tableCell,  {color: '#979797', marginLeft: 6}]}>Conocimiento Previo</Text>
                                        </View>
                                    </View>
                                    <View style={styles.tableRow}>
                                        <View style={styles.tableCol}>
                                            <Text style={[styles.tableCell, {marginBottom: 10}]}>{design.metadata.classSize}</Text>
                                        </View>
                                        <View style={styles.tableCol}>
                                            {(design.metadata.priorKnowledge === '') ?
                                                <Text style={[styles.tableCell, {marginBottom: 10, marginLeft: 6}]}>No especificado.</Text>
                                                :
                                                <Text style={[styles.tableCell, {marginBottom: 10, marginLeft: 6}]}>{design.metadata.priorKnowledge}</Text>
                                            }
                                        </View>
                                    </View>
                                </>
                            }
                            <View style={ styles.tableRow }>
                                <View style={styles.tableCol}>
                                    <Text style={[styles.tableCell,  {color: '#979797'}]}>Descripción</Text>
                                </View>
                                <View style={styles.tableCol}>
                                    <Text style={[styles.tableCell,  {color: '#979797', marginLeft: 6}]}>Objetivos</Text>
                                </View>
                            </View>
                            <View style={styles.tableRow}> 
                                <View style={styles.tableCol}> 
                                    {(design.metadata.description === '') ?
                                        <Text style={[styles.tableCell, {marginBottom: 10, marginRight: 6}]}> No especificado. </Text>
                                        : 
                                        <Text style={[styles.tableCell, {marginBottom: 10, marginRight: 6}]}> {design.metadata.description}. </Text>
                                    } 
                                </View>
                                <View style={styles.tableCol}>
                                    {(design.metadata.objective === '') ?
                                      <Text style={[styles.tableCell, {marginBottom: 10, marginLeft: 6}]}> No especificado. </Text>
                                      : 
                                      <Text style={[styles.tableCell, {marginBottom: 10, marginLeft: 6}]}> {design.metadata.objective}. </Text>
                                    } 
                                </View>
                            </View>
                        </View>
                        { design.data.learningActivities && design.data.learningActivities.map((learningActivity, index) =>
                            <View key = {`learning-activity-${index}`}> 
                                <Text style={styles.marginTitle}> {learningActivity.title} </Text>
                                { learningActivity.tasks && learningActivity.tasks.map((task, indexTask) =>
                                        <View key = {`task-${indexTask}`} >
                                            <View>
                                                <View style={[styles.table, { marginBottom: 20, borderTop: 1, borderColor: '#808080'} ]}>
                                                    <View style={ styles.tableRow }>
                                                        {(typeUserPDF === 'teacher') && 
                                                            <View style={styles.tableCol}>
                                                                <Text style={[styles.tableCell,  {color: '#979797'}]}>Aprendizaje</Text>
                                                            </View>
                                                        }
                                                        <View style={styles.tableCol}>
                                                            <Text style={[styles.tableCell,  {color: '#979797'}]}>Tiempo</Text>
                                                        </View>
                                                        <View style={styles.tableCol}>
                                                            <Text style={[styles.tableCell,  {color: '#979797'}]}>Modalidad</Text>
                                                        </View>
                                                    </View>
                                                    <View style={ styles.tableRow }>
                                                        {(typeUserPDF === 'teacher') && 
                                                            <View style={styles.tableCol}>
                                                                { (task.learningType === 'Seleccionar' || task.learningType.trim().length === 0) ?
                                                                    <Text style={styles.tableCell}>No especificado.</Text>
                                                                    :
                                                                    <Text style={styles.tableCell}>{task.learningType}</Text>
                                                                }
                                                            </View>
                                                        }
                                                        <View style={styles.tableCol}>
                                                            <Text style={styles.tableCell}>{task.duration.hours} hrs : {task.duration.minutes} min.</Text>
                                                        </View>
                                                        <View style={styles.tableCol}>
                                                            {(task.modality === 'Seleccionar' || task.modality.trim().length === 0) ? 
                                                                <Text style={styles.tableCell}> No especificado. </Text> 
                                                                : 
                                                                <Text style={styles.tableCell}> {task.modality} </Text>
                                                            }
                                                        </View>
                                                    </View>
                                                    <View style={ styles.tableRow }>
                                                        <View style={styles.tableCol}>
                                                            <Text style={[styles.tableCell,  {color: '#979797'}]}>Formato</Text>
                                                        </View>
                                                        {  (task.format === 'Grupal') &&
                                                            <>
                                                            <View style={styles.tableCol}>
                                                                <Text style={[styles.tableCell,  {color: '#979797'}]}>Número de integrantes</Text>
                                                            </View>
                                                            <View style={styles.tableCol}>
                                                            </View>
                                                            </>
                                                        }  
                                                    </View>
                                                    <View style={ styles.tableRow }>
                                                        <View style={styles.tableCol}>
                                                            {(task.format === 'Seleccionar' || task.format.trim().length === 0) ? 
                                                                <Text style={styles.tableCell}> No especificado. </Text> 
                                                                : 
                                                                <Text style={styles.tableCell}> {task.format} </Text>
                                                            }
                                                        </View>
                                                        {  (task.format === 'Grupal') &&
                                                            <>
                                                                <View style={styles.tableCol}>
                                                                    <Text style={styles.tableCell}> {task.groupSize}</Text> 
                                                                </View>
                                                                <View style={styles.tableCol}>
                                                                </View>
                                                            </> 
                                                        }
                                                             
                                                    </View>
                                                    <View>
                                                        <Text style={{fontSize: 12, color: '#979797', marginTop: 20, marginBottom: 5}} >Descripción</Text>
                                                        {(task.description === '') ? 
                                                            <Text wrap style={{fontSize: 12, justifyContent: 'center'}}> No especificado. </Text> 
                                                            : 
                                                            <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>{task.description}</Text>
                                                        }
                                                    </View>
                                                    <View>
                                                        <Text style={{fontSize: 12, color: '#979797', marginTop: 20, marginBottom: 5}} >Enlaces de recursos</Text>
                                                        { (task.resourceLinks.length === 0) ?
                                                            <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>No se han proporcionado recursos</Text>
                                                            : 
                                                            (task.resourceLinks.map((resource, i) =>  
                                                                <div key = {`resource-${i}-task-${indexTask}-learningnActivity${index}`}>
                                                                    <Text style={{fontSize: 12, color: '#979797', marginTop: 10, marginBottom: 10}} >Titulo</Text>
                                                                    <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>{resource.title}</Text>
                                                                    <Text style={{fontSize: 12, color: '#979797', marginTop: 10, marginBottom: 10}} >Enlace</Text>
                                                                    <Link wrap style={{fontSize: 12, justifyContent: 'center'}}>{resource.link}</Link>
                                                                </div> 
                                                            ))
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                )}
                                <View style = {{marginLeft: 50, marginRight: 50}}>
                                    <Text style={{fontSize: 15, color: '#979797', marginTop: 5}} >Evaluación de la actividad.</Text>
                                    <Text style={{fontSize: 12, color: '#979797', marginTop: 10, marginBottom: 10}} >Titulo</Text>
                                    {
                                        (learningActivity.evaluation.title === '') ? 
                                        <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>No definido.</Text>
                                        :
                                        <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>{learningActivity.evaluation.title}</Text>
                                    }
                                    <Text style={{fontSize: 12, color: '#979797', marginTop: 10, marginBottom: 10}} >Descripción</Text>
                                    {
                                        (learningActivity.evaluation.description === '') ? 
                                        <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>No definido.</Text>
                                        :
                                        <Text wrap style={{fontSize: 12, justifyContent: 'center'}}>{learningActivity.evaluation.description}</Text>
                                    }
                                    
                                </View>
                            </View>
                        )}
                        <View style = {{marginTop: 15}}>
                            {(typeUserPDF === 'teacher' ) &&
                                <Image
                                    src={img}
                                />
                            }
                        </View>
                    </View>
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                            `${pageNumber} / ${totalPages}`
                        )} fixed />
                </Page>
            </Document>
        </>
    )
}