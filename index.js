const express=require("express");
const path=require("path");
const engine=require("ejs-mate");
const {wrapAsync}=require("./middlewares/wrapAsync");

const port=8000;

const app=express();
app.set("view-engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",engine);

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"/views/public")));

app.get("/",(req,res)=>{
   res.render("index.ejs");
});

app.get("/support",(req,res)=>{
    res.render("support.ejs");
});

app.post("/support",wrapAsync((req,res,next)=>{
    const { fullName, phone, supportType, description } = req.body;
    const requestId = "JC-" + Math.floor(Math.random() * 10000);
    const highPriorityKeywords = [
        "emergency",
        "urgent",
        "accident",
        "chest pain",
        "bleeding"
      ];
      
      const mediumPriorityKeywords = [
        "medicine",
        "diabetes",
        "doctor",
        "consultation",
        "hospital"
      ];
      let priority="low";
      const text=description.toLowerCase();
      if(highPriorityKeywords.some(word=>text.includes(word))) priority="high";
      else if(mediumPriorityKeywords.some(word=>text.includes(word))) priority="medium";

      const summary = `
      Support Type: ${supportType}
      
      Priority: ${priority}
      
      Issue:
      ${description}
      `;
  
    res.render("show.ejs", {
        fullName,
        phone,
        supportType,
        requestId,
        priority,
        summary
    });
}));

app.use((err,req,res,next)=>{
  res.json({"error":err.message});
});

app.listen(port,()=>{
   console.log("App is listening");
});