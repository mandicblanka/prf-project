import { Component, EventEmitter, Output } from '@angular/core';
import { TopicService } from '../../shared/services/topic.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-input-fields',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './input-fields.component.html',
    styleUrl: './input-fields.component.scss'
})
export class InputFieldsComponent {
    title: string = '';
    @Output() topic = new EventEmitter<any>();

    constructor(private topicService: TopicService, private router: Router) { }

    CreateTopic() {
        this.topicService.newTopic(this.title).subscribe({
            next: (data) => {
                if (data) {
                    console.log(data);
                    this.router.navigateByUrl('/topics');
                    this.title = '';
                    this.topic.emit(data);
                }
            }, error: (err) => {
                console.log(err);
            }
        });
    }
}
