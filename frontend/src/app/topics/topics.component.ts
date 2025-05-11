import { Component } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Topic } from '../shared/Model/Topic';
import { TopicService } from '../shared/services/topic.service';
import { CommonModule } from '@angular/common';
import { InputFieldsComponent } from './input-fields/input-fields.component';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {DialogComponent} from "../shared/dialog/dialog.component";


@Component({
    selector: 'app-topics',
    standalone: true,
    imports: [CommonModule, InputFieldsComponent, MatIconModule, FormsModule, MatDialogModule],
    templateUrl: './topics.component.html',
    styleUrl: './topics.component.scss'
})
export class TopicsComponent {
    topics?: Topic[];
    isAuthenticated?: boolean;
    isAdmin?: boolean;
    isEditMode: boolean = false;
    selectedTopicToEdit: string = '';
    editedTitle: string = '';

    constructor(private topicService: TopicService,
                private authService: AuthService,
                private router: Router,
                private dialog: MatDialog) { }

    ngOnInit() {
        this.topicService.getAll().subscribe({
            next: (data) => {
                this.topics = data;
            }, error: (err) => {
                console.log(err);
            }
        });

        this.authService.checkAuth().subscribe({
            next: (data) => {
                this.isAuthenticated = data;
            }, error: (err) => {
                console.log('You are currently not logged in');
            }
        });

        this.authService.isAdmin().subscribe({
            next: (data) => {
                this.isAdmin = data;
            }, error: (err) => {
                console.log('You are not an admin');
            }
        });
    }

    deleteTopic(topicId: string) {
        const dialogRef = this.dialog.open(DialogComponent, {data: { message: 'topic' } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.topicService.deleteTopic(topicId).subscribe({
                    next: (data) => {
                        console.log(data);
                        this.topics = this.topics!.filter(topic => topic._id !== topicId);
                    },
                    error: (err) => {
                        console.log(err);
                    }
                });
            }
        });
    }

    editModeToggle(topicId: string) {
        this.isEditMode = !this.isEditMode;
        if (this.isEditMode) {
            this.selectedTopicToEdit = topicId;
            this.editedTitle = this.topics!.find(topic => topic._id === topicId)!.title;
        } else {
            this.selectedTopicToEdit = '';
            this.editedTitle = '';
        }
    }

    editModeOff() {
        this.isEditMode = false;
        this.selectedTopicToEdit = '';
        this.editedTitle = '';
    }

    editTopic(topicId: string) {
        if (this.topics!.find(topic => topic._id === topicId)!.title !== this.editedTitle) {
            this.topicService.editTopic(topicId, this.editedTitle).subscribe({
                next: (data) => {
                    console.log(data);
                    this.topics = this.topics!.map(topic => {
                        if (topic._id === topicId) {
                            topic.title = this.editedTitle;
                        }
                        return topic;
                    });
                    this.editModeOff();
                }, error: (err) => {
                    console.log(err);
                }
            });
        } else {
            this.editModeOff();
        }
    }

    recieveTopic(event: any) {
        this.topics?.push(event);
    }

    navigate(to: string) {
        to = '/topic/' + to;
        this.router.navigateByUrl(to);
    }
}
