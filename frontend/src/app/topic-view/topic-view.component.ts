import { Component } from '@angular/core';
import { TopicService } from '../shared/services/topic.service';
import { Topic } from '../shared/Model/Topic';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Comment } from '../shared/Model/Comment';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { User } from '../shared/Model/User';
import { AuthService } from '../shared/services/auth.service';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-topic-view',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, FormsModule],
    templateUrl: './topic-view.component.html',
    styleUrl: './topic-view.component.scss'
})
export class TopicViewComponent {
    topic?: Topic;
    comments?: Comment[];
    commentText: string = '';
    currentUser?: User;
    scriptTagInComment: boolean = false;
    editMode: boolean = false;
    editedComment: string = '';
    selectedCommentToEdit: string = '';

    constructor(private authService: AuthService,
                private topicService: TopicService,
                private route: ActivatedRoute,
                private router: Router,
                private dialog: MatDialog) { }

    topicSubscription =
        this.topicService.getTopic(this.route.snapshot.paramMap.get('id')!).subscribe(
            (data) => {
                this.topic = data;
                this.comments = data.comments as unknown as Comment[];
                this.comments?.forEach(comment => { comment.comment = comment.comment.replace(/\n/g, '<br>'); });
                this.comments?.forEach(comment => {
                    comment.comment = comment.comment.replace(/<img/g, '<img width="90%"');
                });
                console.log(data);
            }, (err) => {
                console.log(err);
                this.router.navigateByUrl('/topics');
            }
        );

    ngOnInit() {
        this.authService.whoAmI().subscribe({
            next: (data) => {
                this.currentUser = data;
            }, error: (err) => {
                console.log(err);
            }
        });

    }

    updateTopic() {
        const id = this.route.snapshot.paramMap.get('id');
        this.topicService.getTopic(id!).subscribe({
            next: (data) => {
                this.topic = data;
                this.comments = data.comments as unknown as Comment[];
                this.comments?.forEach(comment => { comment.comment = comment.comment.replace(/\n/g, '<br>'); });
                this.comments?.forEach(comment => {
                    comment.comment = comment.comment.replace(/<img/g, '<img width="90%"');
                });
                console.log(data);
            }, error: (err) => {
                console.log(err);
            }
        });
    }

    likeTopic(topicId: string) {
        this.topicService.likeTopic(this.topic!._id).subscribe({
            next: (data) => {
                console.log(data);
                this.topic = data;
                //this.updateTopic();
            }, error: (err) => {
                console.log(err);
            }
        });
    }

    dislikeTopic(topicId: string) {
        this.topicService.dislikeTopic(this.topic!._id).subscribe({
            next: (data) => {
                console.log(data);
                this.topic = data;
                //this.updateTopic();
            }, error: (err) => {
                console.log(err);
            }
        });
    }

    addComment() {
        if (this.commentText.length > 0) {
            if (this.commentText.includes('<script')) {
                console.log('Your comment contains script tag');
                this.scriptTagInComment = true;
            } else {
                this.scriptTagInComment = false;
                this.topicService.addComment(this.topic!._id, this.commentText).subscribe({
                    next: (data) => {
                        console.log(data);
                        data.comment = data.comment.replace(/\n/g, '<br>');
                        this.comments?.push(data as any as Comment);
                        this.commentText = '';
                    }, error: (err) => {
                        console.log(err);
                    }
                });
            }
        }
    }

    deleteComment(commentId: string) {
        const dialogRef = this.dialog.open(DialogComponent, { data: { message: 'comment' } });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.topicService.deleteComment(this.topic!._id, commentId).subscribe({
                    next: (data) => {
                        console.log(data);
                        this.comments = this.comments?.filter(c => c._id !== commentId);
                    }, error: (err) => {
                        console.log(err);
                    }
                });
            }
        });
    }

    editModeOff() {
        this.editMode = false;
        this.editedComment = '';
        this.selectedCommentToEdit = '';
    }

    editModeToggle(commentId: string) {
        this.editMode = !this.editMode;
        if (this.editMode) {
            this.selectedCommentToEdit = commentId;
            this.editedComment = this.comments!.find(c => c._id === commentId)!.comment;
            this.editedComment = this.editedComment.replace(/<br>/g, '\n');
        } else {
            this.selectedCommentToEdit = '';
            this.editedComment = '';
        }
    }

    editComment(commentId: string) {
        const tmpComment = this.editedComment.replace(/\n/g, '<br>');
        if (this.comments!.find(c => c._id === commentId)!.comment !== tmpComment) {
            this.topicService.editComment(this.topic!._id, commentId, this.editedComment).subscribe({
                next: (data) => {
                    console.log(data);
                    this.comments = this.comments!.map(c => {
                        if (c._id === commentId) {
                            c.comment = this.editedComment;
                            c.comment = c.comment.replace(/\n/g, '<br>');
                        }
                        return c;
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

    likeComment(commentId: string) {
        this.topicService.likeComment(this.topic!._id, commentId).subscribe({
            next: (data) => {
                console.log(data);
                if (data) {
                    this.topic = data;
                    this.updateTopic();
                }
            }, error: (err) => {
                console.log(err);
            }
        });
    }

    dislikeComment(commentId: string) {
        this.topicService.dislikeComment(this.topic!._id, commentId).subscribe({
            next: (data) => {
                console.log(data);
                if (data) {
                    this.topic = data;
                    this.updateTopic();
                }
            }, error: (err) => {
                console.log(err);
            }
        });
    }

    hasUserLikedTopic(topic: Topic): boolean {
        if (!topic!.usersLikesTopic) return false;
        if (topic!.usersLikesTopic && topic.usersLikesTopic.length === 0) return false;
        return topic.usersLikesTopic.some(user => user.username === this.currentUser?.email);
    }

    hasUserLikedComment(comment: Comment): boolean {
        return comment.usersLikesComment.some(user => user.username === this.currentUser?.email);
    }

    navigate(to: string) {
        console.log(to);

        this.router.navigateByUrl(to);
    }
}
