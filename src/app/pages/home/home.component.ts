import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { ChartType, ChartConfiguration, ChartEvent } from 'chart.js';
import { Router } from '@angular/router';
import { ChartData } from 'src/app/core/models/ChartData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public titlePage: string = 'Medals per Country';
  public olympicsData$: Observable<Olympic[]> = new Observable<Olympic[]>();
  public labelJos: string = 'JOs';
  public sumOfJOs: number = 0;
  public labelCountries: string = 'Countries';
  public sumOfCountries: number = 0;
  
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true
        }
      },
    },
  };
  public pieChartLabels: string[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend: boolean = true;
  public pieChartData: ChartData[] = [];
  
  private subscription: Subscription = new Subscription;

  constructor(private olympicService: OlympicService, private router: Router) {}
  
  ngOnInit(): void {
    this.olympicsData$ = this.olympicService.getOlympics();

    this.subscription = this.olympicsData$.subscribe((olympics: Olympic[]) => {
      this.sumOfCountries = olympics.length;

      this.sumOfJOs = Array.from(
        new Set(
          olympics
            .map((olympic) => olympic.participations.map((participation) => participation.year))
            .flat()
        )
      ).length;

      this.pieChartLabels = olympics.map((olympic) => olympic.country);

      this.pieChartData = [
        {
          data: olympics.map((olympic) =>
            olympic.participations.reduce(
              (totalMedals, participation) =>
                totalMedals + participation.medalsCount,
              0
            )
          ),
          label: 'Medal',
        },
      ];
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public chartClicked({active}: {
    event?: ChartEvent | undefined;
    active?: any[] | undefined;
  }): void {
    if (active && active.length > 0) {
      const sub: Subscription = this.olympicsData$.subscribe((olympics: Olympic[]) => {
        const clickedElementIndex = active[0].index;
        const countryId = olympics[clickedElementIndex].id;
        this.router.navigate(['/country', countryId]);
        sub.unsubscribe();
      });
    }
  }
}
