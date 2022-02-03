import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {
  listTarjetas : any[] =[
    //{titular: "Juan Perez", numeroTarjeta: "123123", fechaExpiracion:"11/12", cvv:"123"},
    //{titular: "Roberto Juarez", numeroTarjeta: "123123", fechaExpiracion:"11/12", cvv:"123"},
    //{titular: "Nena Gomez", numeroTarjeta: "123123", fechaExpiracion:"11/12", cvv:"123"},
  ];
  accion = 'Agregar';
  id: number | undefined;

form: FormGroup;

  constructor(private fb: FormBuilder
    ,private toastr: ToastrService
    ,private _tarjetaService: TarjetaService) { 
   
    this.form = this.fb.group({
      titular: ['',Validators.required],
      numeroTarjeta: ['',[Validators.required,Validators.maxLength(16),Validators.minLength(16)]],
      fechaExpiracion: ['',[Validators.required,Validators.maxLength(5),Validators.minLength(5)]],
      cvv: ['',[Validators.required,Validators.maxLength(3),Validators.minLength(3)]]
    })
  }

  ngOnInit(): void {
    this.obtenerTarjetas();
  }

  obtenerTarjetas(){
    this._tarjetaService.getlistTarjetas().subscribe(data => {
      console.log(data);
      this.listTarjetas = data;
    }, error => {
      console.log(error);
    })
  }

  guardarTarjeta(){
    
    const tarjeta: any = {
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      fechaExpiracion: this.form.get('fechaExpiracion')?.value,
      cvv: this.form.get('cvv')?.value,
    }

    if(this.id == undefined){
      //agregamos una nueva tarjeta
      //this.listTarjetas.push(tarjeta);
      this._tarjetaService.saveTarjeta(tarjeta).subscribe(data => {
        this.toastr.success('La tarjeta fue registrada con exito', 'Tarjeta Registrada');
        this.obtenerTarjetas();
        this.form.reset();
      },error => {
        this.toastr.error('Ocurrio un Error','Error');
        console.log(error);
      })

    }
    else{
      tarjeta.id = this.id;
      //Editamos una ya existente
      this._tarjetaService.updateTarjeta(this.id,tarjeta).subscribe(data => {
        this.form.reset();
        this.accion = 'agregar';
        this.id = undefined;
        this.toastr.success('La tarjeta fue actualizada con exito', 'Tarjeta Actualizada');
        this.obtenerTarjetas();
      },error =>{
        console.log(error);
      });
      

    }
    
    
    //console.log(tarjeta);
  }

  eliminarTarjeta(id: number){
    //this.listTarjetas.splice(index,1);
    this._tarjetaService.deleteTarjeta(id).subscribe(data => {
      this.toastr.error('La tarjeta fue eliminada con exito','Tarjeta Eliminada');
      this.obtenerTarjetas();
    },error => {
      console.log(error);
    })
    
    
  }

  editarTarjeta(tarjeta: any){
    this.accion = 'editar';
    this.id = tarjeta.id;

    this.form.patchValue({
      titular: tarjeta.titular,
      numeroTarjeta: tarjeta.numeroTarjeta,
      fechaExpiracion: tarjeta.fechaExpiracion,
      cvv: tarjeta.cvv,
    })
  }

}
