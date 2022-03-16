import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-documents',
  templateUrl: './select-documents.component.html',
  styleUrls: ['./select-documents.component.css'],
})
export class SelectDocumentsComponent implements OnInit {
  selectedPromo!: string;
  selectedClass!: string;
  selectedCours!: string;
  selectedCoursType!: string;

  documentsSnap: any;
  constructor(
    private router: ActivatedRoute,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.router.params.subscribe((params) => {
      this.selectedPromo = params['promo'];
      this.selectedClass = params['class'];
      this.selectedCours = params['cours'];
      this.selectedCoursType = params['coursType'];
    });
    this.afs
      .collection('efrei/' +this.selectedPromo + 
      '/class/'+this.selectedClass+
      '/cours/'+this.selectedCours+
      '/coursType/'+this.selectedCoursType
      + '/documents')
      .ref.get()
      .then((data) => (this.documentsSnap = data.docs));
    console.log(this.documentsSnap)
  }
}
