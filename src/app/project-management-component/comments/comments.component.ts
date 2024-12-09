import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { apiPaths } from '../../apiPaths';
import { ApiService } from '../../services/api.service';
import { sessionObject } from '../../login/session';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comments.component.html'
})
export class CommentsComponent {
@Input('entity') entity:any;
@Input('entityType') entityType:any;

constructor(private apiService:ApiService){

}

ngOnInit(): void {
  
}

ngOnChanges(){
  this.viewComments(this.entity._id, this.entityType, this.entity);
}

addComment(entityId:string, entityType:string, comment:any, discussion:any){
  let userId = sessionObject.user._id;
  let commentObj = {
    "comment": comment.value,
    "entityType": entityType,
    "entityId": entityId,
    "commentedBy": userId
}

  this.apiService.post(apiPaths.addComment, commentObj).subscribe({
    next: (response:any) => {
      comment.value = '';
     this.viewComments(entityId, entityType, discussion);
    }
  });
}

viewComments(entityId:string, entityType:string, entity:any){
  this.apiService.get(apiPaths.getComments+'?entityId=' + entityId + '&entityType=' + entityType).subscribe({
    next: (response:any) => {
      entity.comments = response.comments;
    }
  });
}
}
