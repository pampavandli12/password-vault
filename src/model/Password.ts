// model/Post.js
import {Model} from '@nozbe/watermelondb';
import {field, text} from '@nozbe/watermelondb/decorators';

export default class Passwords extends Model {
  static table = 'passwords';
  @text('email') email!: string;
  @text('username') username!: string;
  @text('password') password!: string;
  @text('title') title!: string;
  @text('website') website!: string;
  @text('notes') notes!: string;
}
