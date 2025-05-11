import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Topic } from '../Model/Topic';
import { Comment } from '../Model/Comment';

@Injectable({
    providedIn: 'root'
})
export class TopicService {

    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Topic[]>('http://localhost:3000/app/all_topics', {withCredentials: true});
    }

    getTopic(topicId: string) {
        return this.http.get<Topic>(`http://localhost:3000/app/topic/${topicId}`, {withCredentials: true});
    }

    getUserTopics() {
        return this.http.get<Topic[]>('http://localhost:3000/app/my_topics', {withCredentials: true});
    }

    newTopic(title: string) {
        const body = new URLSearchParams();
        body.set('title', title);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.post<Topic>('http://localhost:3000/app/new_topic', body, {headers: headers, withCredentials: true});
    }

    deleteTopic(topicId: string) {
        return this.http.delete(`http://localhost:3000/app/delete_topic/${topicId}`, {withCredentials: true, responseType: 'text'});
    }

    editTopic(topicId: string, title: string) {
        const body = new URLSearchParams();
        body.set('title', title);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.put(`http://localhost:3000/app/edit_topic/${topicId}`, body, {headers: headers, withCredentials: true, responseType: 'text'});
    }

    addComment(topicId: string, comment: string) {
        const body = new URLSearchParams();
        body.set('comment', comment);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.post<Comment>(`http://localhost:3000/app/new_comment/${topicId}`, body, {headers: headers, withCredentials: true});
    }

    editComment(topicId: string, commentId: string, comment: string) {
        const body = new URLSearchParams();
        body.set('comment', comment);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.put(`http://localhost:3000/app/edit_comment/${topicId}/${commentId}`, body, {headers: headers, withCredentials: true, responseType: 'text'});
    }

    deleteComment(topicId: string, commentId: string) {
        return this.http.delete(`http://localhost:3000/app/delete_comment/${topicId}/${commentId}`, {withCredentials: true, responseType: 'text'});
    }

    likeComment(topicId: string, commentId: string) {
        return this.http.put<Topic>(`http://localhost:3000/app/like_comment/${topicId}/${commentId}`, {}, {withCredentials: true});
    }

    dislikeComment(topicId: string, commentId: string) {
        return this.http.put<Topic>(`http://localhost:3000/app/dislike_comment/${topicId}/${commentId}`, {}, {withCredentials: true});
    }

    likeTopic(topicId: string) {
        return this.http.put<Topic>(`http://localhost:3000/app/like_topic/${topicId}`, {}, {withCredentials: true});
    }

    dislikeTopic(topicId: string) {
        return this.http.put<Topic>(`http://localhost:3000/app/dislike_topic/${topicId}`, {}, {withCredentials: true});
    }
}
