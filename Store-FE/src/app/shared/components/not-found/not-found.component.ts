import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Button, Card],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.less',
})
export class NotFoundComponent {}
