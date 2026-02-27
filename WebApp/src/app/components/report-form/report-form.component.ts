import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AnimalService} from '@app/services/animal.service';
import {ReportRequestDto} from '@app/models/ReportRequestDto';
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss']
})
export class ReportFormComponent implements OnInit {
  years: number[];
  blob = new Blob();
  generationForm = new FormGroup({
    year: new FormControl(),
    type: new FormControl()
  });

  constructor(private animalService: AnimalService) { }

  ngOnInit(): void {
    this.years = this.range(2007, new Date().getFullYear());
  }

  range(start, end): number[] {
    const list = [];
    for (let i = end; i >= start; i--) {
      list.push(i);
    }
    return list;
  }

  onSubmit() {
    const settings = new ReportRequestDto();
    settings.Year = +this.generationForm.get('year').value;
    settings.AnimalType = +this.generationForm.get('type').value;
    this.animalService.getAnimalYearReport(settings).subscribe((data) => {
      const blob = new Blob([data],
        { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, 'godisnjiIzvestaj.docx');
    },
      error => console.log(error)
    );
  }
}
