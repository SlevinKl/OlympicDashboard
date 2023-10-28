import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';
import { ChartType, ChartConfiguration } from 'chart.js';
import { ChartData } from 'src/app/core/models/ChartData';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  public countryData$!: Olympic | undefined;
  public countryName: string = '';
  public labelEntries: string = 'Entries';
  public totalParticipations: number = 0
  public labelMedals: string = 'Medals';
  public totalMedals: number = 0
  public labelAthletes: string = 'Athletes';
  public totalAthletes: number = 0

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    elements: {
      bar: {
        backgroundColor: 'rgba(6, 130, 143, 0.5)',
        borderColor: 'rgba(6, 130, 143, 1)',
        hoverBackgroundColor: 'rgba(6, 130, 143, 0.7)',
        borderWidth: 1,
      },
    },
  };
  public barChartLabels: string[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: ChartData[] = [];

  private countryDataSubscription: Subscription = new Subscription();

  constructor(
    private olympicService: OlympicService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.countryDataSubscription = this.route.paramMap.subscribe((params) => {
      this.countryData$ = this.olympicService.getCountrybyId(Number(params.get('id')));
    });

    if (this.countryData$) {
      // stats
      this.countryName = this.countryData$?.country || '';
      this.totalParticipations = this.countryData$.participations.length;
      this.totalMedals = this.countryData$.participations.reduce(
        (sum, participation) => sum + participation.medalsCount,
        0
      );
      this.totalAthletes = this.countryData$.participations.reduce(
        (sum, participation) => sum + participation.athleteCount,
        0
      );

      // Graphic
      // create graphic label
      this.barChartLabels = this.countryData$.participations.map((participation) =>
        participation.year.toString()
      );

      // create graphic data
      const medalsData = this.countryData$.participations.map((participation) =>
        participation.medalsCount
      );

      this.barChartData = [
        {
          data: medalsData,
          label: 'Medals'
        }
      ];
    } else {
      this.router.navigate(['/not-found']);
    }
  }

  ngOnDestroy(): void {
    this.countryDataSubscription.unsubscribe();
  }
}
