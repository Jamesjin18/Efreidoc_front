import { Injectable } from '@angular/core';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ResearchService {
    recherche = '';
    resultResearch: string[] = [];

    async search() {
        this.resultResearch = [];
        const recherche = this.recherche.toLowerCase();
        console.log('search');
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'efrei'));
        querySnapshot.forEach(async (doc) => {
            if (doc.id.toLowerCase().includes(recherche)) {
                this.resultResearch.push(doc.id);
            }
        
            const querySnapshot2 = await getDocs(
                collection(db, 'efrei', doc.id, 'class')
            );
        
            querySnapshot2.forEach(async (doc2) => {
                if (doc2.id.toLowerCase().includes(recherche)) {
                    this.resultResearch.push(doc.id + '/' + doc2.id);
                }
        
                const querySnapshot3 = await getDocs(
                collection(db, 'efrei', doc.id, 'class', doc2.id, 'cours')
                );
        
                querySnapshot3.forEach(async (doc3) => {
                    if (doc3.id.toLowerCase().includes(recherche)) {
                        this.resultResearch.push(doc.id + '/' + doc2.id + '/' + doc3.id);
                    }
                    console.log('la3');
                    const querySnapshot4 = await getDocs(
                        collection(
                        db,
                        'efrei',
                        doc.id,
                        'class',
                        doc2.id,
                        'cours',
                        doc3.id,
                        'coursType'
                        )
                    );
            
                    querySnapshot4.forEach(async (doc4) => {
                        if (doc4.id.toLowerCase().includes(recherche)) {
                            console.log('ok' + doc4.id + ' ' + recherche);
                            this.resultResearch.push(
                                doc.id + '/' + doc2.id + '/' + doc3.id + '/' + doc4.id
                            );
                        }
            
                        const querySnapshot5 = await getDocs(
                        collection(
                            db,
                            'efrei',
                            doc.id,
                            'class',
                            doc2.id,
                            'cours',
                            doc3.id,
                            'coursType',
                            doc4.id,
                            'documents'
                        )
                        );
                        querySnapshot5.forEach(async (doc5) => {
                            if (doc5.get('name') && doc5.get('username')) {
                                if (
                                    doc5.get('name').toLowerCase().includes(recherche) ||
                                    doc5.get('username').toLowerCase().includes(recherche)
                                ) {
                                    this.resultResearch.push(
                                        doc.id + '/' + doc2.id + '/' + doc3.id + '/' + doc4.id
                                    );
                                }
                                Swal.fire({
                                    title: 'Results',
                                    icon: 'info',
                                    showClass: {
                                        popup: 'animated fadeInDown faster',
                                        icon: 'animated heartBeat delay-1s',
                                    },
                                    hideClass: {
                                        popup: 'animated fadeOutUp faster',
                                    },
                                    html: this.arrayToListHtml(this.resultResearch)
                                });
                            }
                        });
                    });
                });
            });
        });
    }
    
    arrayToListHtml(array: Array<string>) {
        if (array.length === 0) {
            return '<p>resources not found.</p>';
        }
        let html = '<ul>';
        for (const index in array) {
            html +=
            '<li><a href="home/' + array[index] + '">' + array[index] + '</a></li>';
        }
        html += '</ul>';
        return html;
    }
}